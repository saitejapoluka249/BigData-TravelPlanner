import httpx
import time
from app.core.config import settings
from app.schemas.flight import FlightOffer, FlightSegment 
from app.core.cache import get_cache, set_cache

class AmadeusClient:
    def __init__(self):
        self.base_url = "https://test.api.amadeus.com"
        self.client_id = settings.AMADEUS_CLIENT_ID
        self.client_secret = settings.AMADEUS_CLIENT_SECRET
        self.token = None
        self.token_expiry = 0

    async def _get_token(self):
        if self.token and time.time() < self.token_expiry:
            return self.token

        url = f"{self.base_url}/v1/security/oauth2/token"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, data=data)
            if response.status_code != 200:
                print(f"Auth Failed: {response.text}")
                return None
            result = response.json()
            self.token = result["access_token"]
            self.token_expiry = time.time() + result["expires_in"] - 10
            return self.token

    def _parse_flight_data(self, raw_data: dict) -> list[FlightOffer]:
        """
        Parses the raw JSON and resolves codes (B6 -> JetBlue) using the dictionaries.
        """
        clean_results = []
        if "data" not in raw_data:
            return []

        carriers_dict = raw_data.get("dictionaries", {}).get("carriers", {})

        for offer in raw_data["data"]:
            try:
                price = float(offer["price"]["grandTotal"])
                currency = offer["price"]["currency"]
                
                itinerary = offer["itineraries"][0]
                duration = itinerary["duration"].replace("PT", "")
                segments = itinerary["segments"]
                
                main_carrier_code = offer["validatingAirlineCodes"][0]
                main_carrier_name = carriers_dict.get(main_carrier_code, main_carrier_code)

                first_segment_details = offer["travelerPricings"][0]["fareDetailsBySegment"][0]
                cabin_class = first_segment_details.get("cabin", "UNKNOWN")

                clean_segments = []
                for seg in segments:
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
                    stops=len(segments) - 1,
                    segments=clean_segments
                )
                clean_results.append(flight_obj)

            except Exception as e:
                print(f"Error parsing flight offer: {e}")
                continue
        
        return clean_results

    async def search_flights(self, origin: str, destination: str, date: str):

        cache_key = f"flight_search:{origin}:{destination}:{date}"


        cached_data = get_cache(cache_key)
        if cached_data:
            return cached_data  # Return instantly!


        token = await self._get_token()
        if not token:
            return {"error": "Authentication Failed"}

        url = f"{self.base_url}/v2/shopping/flight-offers"
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": date,
            "adults": 1,
            "max": 50,  
            "currencyCode": "USD"
        }

        async with httpx.AsyncClient() as client:
            try:
                print(f"✈️ Calling Amadeus API for: {origin} -> {destination}")
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
            



    async def search_locations(self, keyword: str):
        """
        Search for a city or airport by keyword, with a 30-day cache.
        """

        cache_key = f"location_search:{keyword.lower()}"

        cached_data = get_cache(cache_key)
        if cached_data:
            return cached_data


        token = await self._get_token()
        if not token:
            return {"error": "Authentication Failed"}

        url = f"{self.base_url}/v1/reference-data/locations"
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "subType": "CITY,AIRPORT",
            "keyword": keyword,
            "countryCode": "US",
            "page[limit]": 20,
            "view": "FULL",
            "sort": "analytics.travelers.score"
        }


        print(f"🌍 Calling Amadeus API for Locations: {keyword}")
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers, params=params)
                if response.status_code != 200:
                    print(f"Location search error: {response.text}")
                    return []
                
                data = response.json().get("data", [])
                
                clean_locations = []
                for loc in data:
                    if "iataCode" in loc:
                        clean_locations.append({
                            "id": loc.get("id"),
                            "name": loc.get("name"),
                            "detailed_name": loc.get("detailedName"),
                            "iata_code": loc.get("iataCode"),
                            "geo_code": loc.get("geoCode"), 
                            "address": loc.get("address")   
                        })


                if clean_locations:
                    set_cache(cache_key, clean_locations, expire_seconds=2592000)

                return clean_locations

            except Exception as e:
                print(f"Error fetching locations: {e}")
                return []


amadeus_client = AmadeusClient()