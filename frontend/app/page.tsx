'use client'

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TripResults from '@/components/results/TripResults';
import dynamic from 'next/dynamic';
import { travelApi, TripSearchParams } from '@/services/api';

// Dynamically import map to prevent Server-Side Rendering errors with Leaflet
const DynamicMap = dynamic(() => import('@/components/map/TripMap'), { ssr: false });

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Triggered when the user submits the form in the Sidebar
  const handleSearch = async (params: TripSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Fetch core destination/OSM data first
      const destinationData = await travelApi.getDestinationData(params);
      
      if (!destinationData) {
        // If your destination API fails to find coordinates, warn the user
        setError("Could not retrieve map coordinates for this destination. Showing default map.");
      }

      // 2. Fetch the rest of the microservices concurrently
      const [flights, stays, weather, attractions] = await Promise.all([
        travelApi.getFlights(params),
        travelApi.getStays(params),
        travelApi.getWeather(params.destination, { start: params.startDate, end: params.endDate }),
        travelApi.getAttractions(params.destination, params.radius)
      ]);

      // 3. Update state with all gathered data
      setTripData({ destinationData, flights, stays, weather, attractions });
    } catch (err) {
      console.error("Failed to fetch trip data:", err);
      setError("An error occurred while fetching your trip details from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!tripData) return;
    
    const blob = await travelApi.exportPdf(tripData);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'WanderPlan_Itinerary.pdf';
      a.click();
      window.URL.revokeObjectURL(url); // Clean up memory
    } else {
      alert("Failed to generate PDF document.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar for Input */}
      <Sidebar onSearch={handleSearch} loading={loading} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Destination Overview & Nearby Places</h1>
          <button 
            onClick={handleExportPDF}
            disabled={!tripData || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Export as PDF
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md shadow-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Top: Leaflet Map */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 h-[400px] relative z-0">
          <DynamicMap 
            mapData={tripData?.destinationData} 
            attractions={tripData?.attractions} 
            stays={tripData?.stays} 
          />
        </div>

        {/* Bottom: Results Grid */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Results</h2>
        {tripData ? (
          <TripResults data={tripData} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="text-4xl mb-3">🌍</div>
            <p className="text-gray-500 font-medium">
              {loading ? "Searching across multiple services..." : "Enter your trip details to generate an itinerary."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}