// larry6683/big-data-project-travel-app/frontend/services/api.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface LocationResult {
  city?: string;
  name?: string;
  state?: string;
  iata?: string;
  type: 'city' | 'airport';
  distance?: number;
  lat?: number;
  lon?: number;
}

export interface TripSearchParams {
  source: any;
  destination: any;
  startDate: string;
  endDate: string;
  numNights: number;
  adults: number;
  children: number;
  travelMode: 'fly' | 'drive';
  budget: 'budget' | 'luxury';
  radius: number;
  interests: string[];
}

// Helper to extract a 3-letter IATA code from the location name for the Amadeus Flights API
const extractIATA = (locationName: string) => {
  const match = locationName.match(/\b[A-Z]{3}\b/);
  return match ? match[0] : locationName.substring(0, 3).toUpperCase();
};

export const travelApi = {
  searchLocations: async (keyword: string, lat?: number, lon?: number): Promise<LocationResult[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/search`, {
        params: { keyword, lat, lon }
      });
      return response.data;
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  },
  
  getNearestCity: async (lat: number, lon: number): Promise<LocationResult | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/nearest`, {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getDestinationData: async (params: any) => ({ lat: params?.destination?.lat, lon: params?.destination?.lon }),

  // 1. Fetch Flights (Amadeus)
  getFlights: async (params: TripSearchParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/flights/search`, {
        params: {
          origin: params.source.iata || extractIATA(params.source.name),
          destination: params.destination.iata || extractIATA(params.destination.name),
          date: params.startDate,
          return_date: params.endDate,
          adults: params.adults,
          children: params.children,
          travel_class: params.budget === 'luxury' ? 'BUSINESS' : 'ECONOMY'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch flights:", error);
      return [];
    }
  },

  // 2. Fetch Driving Route (OSRM)
  getDriving: async (params: TripSearchParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/driving/route`, {
        params: {
          origin_lat: params.source.lat,
          origin_lon: params.source.lon,
          dest_lat: params.destination.lat,
          dest_lon: params.destination.lon
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch driving route:", error);
      return null;
    }
  },

  // 3. Fetch Stays (Amadeus)
  getStays: async (params: TripSearchParams) => {
    try {
      // Convert miles to kilometers for the hotel radius parameter
      const radiusKm = Math.round(params.radius * 1.60934); 
      const response = await axios.get(`${API_BASE_URL}/hotels/nearby`, {
        params: {
          lat: params.destination.lat,
          lon: params.destination.lon,
          check_in_date: params.startDate,
          check_out_date: params.endDate,
          adults: params.adults,
          radius: radiusKm || 50
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch stays:", error);
      return [];
    }
  },

  // 4. Fetch Weather (OpenWeather)
  getWeather: async (dest: any, dates: any) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/forecast`, {
        params: {
          lat: dest.lat,
          lon: dest.lon,
          check_in_date: dates.start,
          check_out_date: dates.end
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      return null;
    }
  },

  // 5. Fetch Attractions (OSM / Amadeus)
  getAttractions: async (dest: any, radiusMiles: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attractions/nearby`, {
        params: {
          lat: dest.lat,
          lon: dest.lon,
          radius_miles: radiusMiles
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch attractions:", error);
      return [];
    }
  },

  exportPdf: async (data: any) => new Blob()
};