import httpx
from app.services.base_client import BaseAmadeusClient
from app.schemas.flight import FlightOffer, FlightSegment 
from app.core.cache import get_cache, set_cache

class FlightService(BaseAmadeusClient):
    
    def _parse_flight_data(self, raw_data: dict) -> list[FlightOffer]:
        clean_results = []
        if "data" not in raw_data:
            return []

        carriers_dict = raw_data.get("dictionaries", {}).get("carriers", {})

        for offer in raw_data["data"]:
            try:
                price = float(offer["price"]["grandTotal"])
                currency = offer["price"]["currency"]
                
                duration = offer["itineraries"][0]["duration"].replace("PT", "")
                
                main_carrier_code = offer["validatingAirlineCodes"][0]
                main_carrier_name = carriers_dict.get(main_carrier_code, main_carrier_code)

                first_segment_details = offer["travelerPricings"][0]["fareDetailsBySegment"][0]
                cabin_class = first_segment_details.get("cabin", "UNKNOWN")

                clean_segments = []
                for itinerary in offer["itineraries"]:
                    for seg in itinerary["segments"]:
                        seg_carrier_code = seg["carrierCode"]
                        seg_carrier_name = carriers_dict.get(seg_carrier_code, seg_carrier_code)
                        
                        clean_segments.append(FlightSegment(
                            departure_airport=seg["departure"]["iataCode"],
                            departure_time=seg["departure"]["at"],
                            arrival_airport=seg["arrival"]["iataCode"],
                            arrival_time=seg["arrival"]["at"],
                            carrier_code=seg_carrier_code,
                            carrier_name=seg_carrier_name,  
                            flight_number=seg["number"]
                        ))

                flight_obj = FlightOffer(
                    id=offer["id"],
                    price=price,
                    currency=currency,
                    airline_code=main_carrier_code,
                    airline_name=main_carrier_name,    
                    cabin_class=cabin_class,        
                    duration=duration,
                    stops=len(clean_segments) - len(offer["itineraries"]),
                    segments=clean_segments
                )
                clean_results.append(flight_obj)

            except Exception as e:
                print(f"Error parsing flight offer: {e}")
                continue
        
        return clean_results

    async def search_flights(self, origin: str, destination: str, date: str, return_date: str, adults: int, travel_class: str = "ECONOMY", children: int = 0):
        
        cache_key = f"flight_search:{origin}:{destination}:{date}:{return_date}:{adults}:{travel_class}:{children}"
        
        cached_data = get_cache(cache_key)
        if cached_data:
            return cached_data

        token = await self.get_token()
        if not token:
            return {"error": "Authentication Failed"}

        url = f"{self.base_url}/v2/shopping/flight-offers"
        headers = {"Authorization": f"Bearer {token}"}
        
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": date,
            "returnDate": return_date, 
            "adults": adults,
            "travelClass": travel_class.upper(),
            "max": 20,  
            "currencyCode": "USD"
        }

        if children > 0:
            params["children"] = children

        async with httpx.AsyncClient() as client:
            try:
                print(f"✈️ Calling Amadeus: {origin}->{destination} | Out: {date} | Return: {return_date} | Adults: {adults}")
                response = await client.get(url, headers=headers, params=params, timeout=30.0)
                if response.status_code != 200:
                    return {"error": response.text}
                
                raw_data = response.json()
                clean_data = self._parse_flight_data(raw_data)

                if clean_data:
                    set_cache(cache_key, clean_data, expire_seconds=1800)
                
                return clean_data
            except httpx.ReadTimeout:
                return {"error": "Amadeus API timed out"}

# Singleton instance
flight_service = FlightService()