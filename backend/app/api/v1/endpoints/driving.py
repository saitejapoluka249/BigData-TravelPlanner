# larry6683/big-data-project-travel-app/backend/app/api/v1/endpoints/driving.py

from fastapi import APIRouter, Query, Depends
from app.services.driving_service import DrivingService

router = APIRouter()

@router.get("/route")
async def get_driving_route(
    origin_lat: float,
    origin_lon: float,
    dest_lat: float,
    dest_lon: float,
    service: DrivingService = Depends()
):
    return await service.get_route(origin_lat, origin_lon, dest_lat, dest_lon)