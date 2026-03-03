// services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TripSearchParams {
  source: string;       
  destination: string;  
  startDate: string;
  endDate: string;
  budget: 'Budget' | 'Luxury';
  radius: number;
  adults?: number;      
  children?: number;    
}

export interface FlightOption {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
}

export const travelApi = {
  // 1. Initial Search / OSM Data (Gets map coordinates and radius)
  getDestinationData: async (params: TripSearchParams) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Failed to fetch destination data');
      return await res.json();
    } catch (error) {
      console.error("Error fetching destination data:", error);
      return null;
    }
  },

  // 2. Flights Service (Updated for GET with query parameters)
  getFlights: async (params: TripSearchParams): Promise<FlightOption[]> => {
    try {
      const travelClass = params.budget === 'Luxury' ? 'BUSINESS' : 'ECONOMY';
      const numAdults = params.adults ? params.adults.toString() : '1';

      const query = new URLSearchParams({
        origin: params.source,           
        destination: params.destination, 
        date: params.startDate,          
        return_date: params.endDate,     
        adults: numAdults,
        travel_class: travelClass,
      });

      if (params.children) {
        query.append('children', params.children.toString());
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/flights/search?${query.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) throw new Error(`Flight API error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching flights:", error);
      return []; 
    }
  },

  // 3. Stays Service
  getStays: async (params: TripSearchParams) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Failed to fetch stays');
      return await res.json();
    } catch (error) {
      console.error("Error fetching stays:", error);
      return [];
    }
  },

  // 4. Weather Service
  getWeather: async (destination: string, dates: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/weather?city=${destination}`);
      if (!res.ok) throw new Error('Failed to fetch weather');
      return await res.json();
    } catch (error) {
      console.error("Error fetching weather:", error);
      return [];
    }
  },

  // 5. Attractions Service
  getAttractions: async (destination: string, radius: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/attractions?city=${destination}&radius=${radius}`);
      if (!res.ok) throw new Error('Failed to fetch attractions');
      return await res.json();
    } catch (error) {
      console.error("Error fetching attractions:", error);
      return [];
    }
  },

  // 6. PDF Generation Service
  exportPdf: async (tripData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      return await res.blob();
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  }
};