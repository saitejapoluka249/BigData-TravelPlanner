# backend/app/api/v1/endpoints/trips.py
from fastapi import APIRouter, Response
from app.schemas.trip import TripGenerateRequest
from fpdf import FPDF 
router = APIRouter()

@router.post("/generate-pdf")
async def generate_trip_pdf(payload: TripGenerateRequest):
    pdf = FPDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("helvetica", "B", 24)
    pdf.cell(0, 15, f"Trip Itinerary: {payload.destination}", ln=True, align="C")
    
    # Subheader
    pdf.set_font("helvetica", "I", 12)
    pdf.cell(0, 10, f"Prepared for: {payload.username}", ln=True, align="C")
    pdf.cell(0, 10, f"Dates: {payload.check_in_date} to {payload.check_out_date}", ln=True, align="C")
    pdf.ln(10)

    # Weather Section
    if payload.weather:
        pdf.set_font("helvetica", "B", 16)
        pdf.cell(0, 10, "Weather Forecast", ln=True)
        pdf.set_font("helvetica", "", 12)
        current = payload.weather.get('current', {})
        temp = current.get('temp', 'N/A')
        desc = current.get('description', 'N/A')
        pdf.multi_cell(0, 8, f"Expect {desc} with an average temperature of {temp}F.")
        pdf.ln(5)

    # Flight Section
    if payload.flight:
        pdf.set_font("helvetica", "B", 16)
        pdf.cell(0, 10, "Flight Details", ln=True)
        pdf.set_font("helvetica", "", 12)
        airline = payload.flight.get('airline_name', 'Unknown Airline')
        price = payload.flight.get('price', {}).get('total', 'N/A')
        if isinstance(payload.flight.get('price'), (int, float)): # Handle flat price
            price = payload.flight.get('price')
            
        pdf.multi_cell(0, 8, f"Airline: {airline}\nTotal Price: ${price}")
        pdf.ln(5)

    # Hotel Section
    if payload.hotel:
        pdf.set_font("helvetica", "B", 16)
        pdf.cell(0, 10, "Hotel Details", ln=True)
        pdf.set_font("helvetica", "", 12)
        name = payload.hotel.get('name', 'Unknown Hotel')
        # Extract price from either root or offerDetails
        price = payload.hotel.get('price') or payload.hotel.get('offerDetails', {}).get('price', 'N/A')
        pdf.multi_cell(0, 8, f"Hotel: {name}\nPrice: ${price}")
        pdf.ln(5)

    # Attractions Section
    if payload.attractions:
        pdf.set_font("helvetica", "B", 16)
        pdf.cell(0, 10, "Selected Attractions", ln=True)
        pdf.set_font("helvetica", "", 12)
        for attr in payload.attractions:
            name = attr.get('name', 'Point of Interest')
            pdf.cell(0, 8, f"- {name}", ln=True)
        pdf.ln(5)

    # Activities/Tours Section
    if payload.activities:
        pdf.set_font("helvetica", "B", 16)
        pdf.cell(0, 10, "Activities & Tours", ln=True)
        pdf.set_font("helvetica", "", 12)
        for activity in payload.activities:
            name = activity.get('name', 'Activity')
            price = activity.get('price', {}).get('amount', 'N/A')
            pdf.cell(0, 8, f"- {name} (${price})", ln=True)
        pdf.ln(5)

    return Response(
        content=bytes(pdf.output()), 
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{payload.destination}_Itinerary.pdf"'}
    )