import httpx
from app.services.base_client import BaseAmadeusClient
from app.schemas.hotel import Hotel, HotelOffer
from app.core.cache import get_cache, set_cache

class HotelService(BaseAmadeusClient):
    
    async def search_hotels_by_city(self, city_code: str, ratings: str = "4,5", radius: int = 50):
        cache_key = f"hotel_search:{city_code}:{ratings}:{radius}"
        cached_data = get_cache(cache_key)
        if cached_data:
            return cached_data

        token = await self.get_token()
        if not token:
            return {"error": "Authentication Failed"}

        url = f"{self.base_url}/v1/reference-data/locations/hotels/by-city"
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "cityCode": city_code.upper(),
            "radius": radius,
            "radiusUnit": "KM",
            "ratings": ratings
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers, params=params, timeout=30.0)
                if response.status_code != 200:
                    return {"error": response.text}
                
                raw_data = response.json().get("data", [])
                clean_hotels = []
                for hotel in raw_data:
                    clean_hotels.append(Hotel(
                        chain_code=hotel.get("chainCode"),
                        iata_code=hotel.get("iataCode"),
                        hotel_id=hotel.get("hotelId"),
                        name=hotel.get("name"),
                        geo_code=hotel.get("geoCode"),
                        rating=hotel.get("rating"),
                        distance_km=hotel.get("distance", {}).get("value"),
                        address=hotel.get("address")
                    ))

                if clean_hotels:
                    set_cache(cache_key, clean_hotels, expire_seconds=86400)
                return clean_hotels
            except Exception as e:
                return {"error": str(e)}

    async def get_hotel_offers(self, city_code: str, check_in_date: str, check_out_date: str, adults: int):
        cache_key = f"hotel_offers:{city_code}:{check_in_date}:{check_out_date}:{adults}:4,5"
        cached_data = get_cache(cache_key)
        if cached_data:
            return cached_data

        basic_hotels = await self.search_hotels_by_city(city_code=city_code, ratings="4,5", radius=50)
        if isinstance(basic_hotels, dict) and "error" in basic_hotels:
            return basic_hotels
        if not basic_hotels:
            return []

        hotel_address_map = {h.hotel_id: h.address for h in basic_hotels}
        hotel_geo_map = {h.hotel_id: h.geo_code for h in basic_hotels if h.geo_code}

        hotel_ids_string = ",".join([h.hotel_id for h in basic_hotels[:20]])

        token = await self.get_token()
        url = f"{self.base_url}/v3/shopping/hotel-offers"
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "hotelIds": hotel_ids_string,
            "checkInDate": check_in_date,
            "checkOutDate": check_out_date,
            "adults": adults,
            "currency": "USD"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers, params=params, timeout=30.0)
                if response.status_code != 200:
                    return {"error": response.text}
                
                raw_data = response.json().get("data", [])
                clean_offers = []
                for item in raw_data:
                    if "offers" not in item or not item["offers"]:
                        continue
                    try:
                        hotel_info = item["hotel"]
                        best_offer = item["offers"][0]
                        hotel_id = hotel_info.get("hotelId")
                        
                        lat = hotel_info.get("latitude")
                        lon = hotel_info.get("longitude")
                        
                        if not lat or not lon:
                            backup_geo = hotel_geo_map.get(hotel_id, {})
                            lat = backup_geo.get("latitude")
                            lon = backup_geo.get("longitude")

                        clean_offers.append(HotelOffer(
                            hotel_id=hotel_id,
                            name=hotel_info.get("name"),
                            check_in_date=best_offer.get("checkInDate"),
                            check_out_date=best_offer.get("checkOutDate"),
                            guests=adults,
                            price=float(best_offer["price"]["total"]),
                            currency=best_offer["price"]["currency"],
                            address=hotel_address_map.get(hotel_id),
                            latitude=lat,  
                            longitude=lon  
                        ))
                    except Exception as parse_err:
                        print(f"Skipping hotel offer due to error: {parse_err}")
                        continue

                if clean_offers:
                    set_cache(cache_key, clean_offers, expire_seconds=1800)
                return clean_offers
            except Exception as e:
                return {"error": str(e)}

hotel_service = HotelService()