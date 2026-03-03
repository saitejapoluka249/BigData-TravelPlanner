from fastapi import APIRouter, Query, HTTPException
from typing import List
from elasticsearch import Elasticsearch
import httpx
from app.core.config import settings
from app.services.location_service import location_service

router = APIRouter()
es = Elasticsearch(settings.ELASTICSEARCH_URL)

@router.on_event("startup")
async def initialize_es_internal():
    """Checks for index and seeds initial city data."""
    try:
        if not es.ping(): return
        index_name = "cities"
        if not es.indices.exists(index=index_name):
            mapping = {
                "mappings": {
                    "properties": {
                        "city": {"type": "search_as_you_type"},
                        "state": {"type": "keyword"},
                        "lat": {"type": "float"},
                        "lon": {"type": "float"},
                        "type": {"type": "keyword"}
                    }
                }
            }
            es.indices.create(index=index_name, body=mapping)
            # Seed data: Note the 'type' field
            sample = [{"city": "Hyderabad", "state": "Telangana", "lat": 17.38, "lon": 78.48, "type": "city"}]
            for item in sample:
                es.index(index=index_name, document=item)
    except Exception as e:
        print(f"ES Init Error: {e}")

@router.get("/search")
async def search_locations(keyword: str):
    """Search with type distinction (City vs Airport)."""
    query = {"query": {"multi_match": {"query": keyword, "type": "bool_prefix", "fields": ["city", "city._2gram"]}}}
    try:
        res = es.search(index="cities", body=query)
        # Add type 'city' to all ES results
        return [dict(hit["_source"], **{"type": "city"}) for hit in res["hits"]["hits"]]
    except:
        # Fallback to Amadeus service (returns airports)
        data = await location_service.search_locations(keyword)
        return [dict(item, **{"type": "airport"}) for item in data]

@router.get("/nearest")
async def get_nearest_city(lat: float, lon: float):
    """High-accuracy reverse geocoding."""
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&zoom=10"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers={"User-Agent": "TravelPlannerApp"})
        data = resp.json().get("address", {})
        city = data.get("city") or data.get("town") or data.get("village")
        return {"city": city, "state": data.get("state"), "type": "city"}