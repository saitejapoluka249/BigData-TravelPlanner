from fastapi import APIRouter
from typing import List
from app.services.amadeus_client import amadeus_client
from app.schemas.location import Location

router = APIRouter()

@router.get("/search", response_model=List[Location])
async def search_locations(keyword: str):
    """
    Autocomplete search for cities/airports.
    User types "Hyd" -> Returns Hyderabad (HYD).
    """
    return await amadeus_client.search_locations(keyword)