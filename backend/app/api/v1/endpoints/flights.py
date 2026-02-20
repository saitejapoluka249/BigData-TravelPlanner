from fastapi import APIRouter, HTTPException
from typing import List
from app.services.amadeus_client import amadeus_client
from app.schemas.flight import FlightOffer 

router = APIRouter()

@router.get("/search", response_model=List[FlightOffer])
async def search_flights(origin: str, destination: str, date: str):
    """
    Search for flights and return CLEAN data.
    """
    result = await amadeus_client.search_flights(origin, destination, date)
    
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result