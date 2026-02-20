from pydantic import BaseModel
from typing import List

class FlightSegment(BaseModel):
    departure_airport: str
    departure_time: str
    arrival_airport: str
    arrival_time: str
    carrier_code: str  
    carrier_name: str  
    flight_number: str

class FlightOffer(BaseModel):
    id: str
    price: float
    currency: str
    airline_code: str  
    airline_name: str  
    cabin_class: str   
    duration: str
    stops: int
    segments: List[FlightSegment]