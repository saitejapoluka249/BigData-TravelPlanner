from pydantic import BaseModel
from typing import Optional, Dict, Any

class Hotel(BaseModel):
    chain_code: Optional[str] = None
    iata_code: str
    hotel_id: str
    name: str
    geo_code: Optional[Dict[str, float]] = None
    rating: Optional[int] = None
    distance_km: Optional[float] = None
    address: Optional[Dict[str, Any]] = None 

class HotelOffer(BaseModel):
    hotel_id: str
    name: str
    check_in_date: str
    check_out_date: str
    guests: int
    price: float
    currency: str
    address: Optional[Dict[str, Any]] = None
    latitude: Optional[float] = None   # <--- Added Latitude
    longitude: Optional[float] = None  # <--- Added Longitude