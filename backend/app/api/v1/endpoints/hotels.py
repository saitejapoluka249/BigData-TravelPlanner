from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.services.hotel_service import hotel_service
from app.schemas.hotel import HotelOffer

router = APIRouter()

@router.get("/offers", response_model=List[HotelOffer])
async def get_hotel_offers(
    city_code: str = Query(..., description="Destination IATA city code (e.g., JFK, PAR)"),
    check_in_date: str = Query(..., description="Arrival Date YYYY-MM-DD"),
    check_out_date: str = Query(..., description="Departure Date YYYY-MM-DD"),
    adults: int = Query(..., description="Number of adults")
):
    """
    Get live 4 and 5 Star hotel pricing (within 50km) for specific dates.
    """
    result = await hotel_service.get_hotel_offers(
        city_code=city_code, 
        check_in_date=check_in_date, 
        check_out_date=check_out_date, 
        adults=adults
    )
    
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result