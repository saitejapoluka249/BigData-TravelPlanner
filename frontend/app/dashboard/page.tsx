"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { travelApi } from "../../services/api";
import Navbar from "../../components/Navbar";
import Link from "next/link";

interface SavedTrip {
  id: number;
  destination: string;
  data: {
    startDate: string;
    endDate: string;
    flight?: {
      airline_name?: string;
      price?: { total: string | number };
    };
    hotel?: {
      name?: string;
      price?: string | number;
    };
    weather?: any;
    activities?: any[];
    attractions?: any[];
  };
}

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isLoggedIn) return;
      try {
        const data = await travelApi.getMyTrips();
        setSavedTrips(data);
      } catch (error) {
        console.error("Failed to load trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [isLoggedIn]);

  const handleDelete = async (tripId: number) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?"))
      return;

    try {
      await travelApi.deleteTrip(tripId);

      // Update the local state only after the backend confirms deletion
      setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
      alert("Trip permanently removed.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete trip from database.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">
          Please login to view your dashboard
        </h1>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Saved Itineraries
            </h1>
            <p className="text-gray-600">
              You have {savedTrips.length} itineraries stored.
            </p>
          </div>
          <Link href="/" className="text-blue-600 font-medium hover:underline">
            + Plan New Trip
          </Link>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center border">
            <p className="text-gray-500 text-lg mb-6">
              No saved trips found yet.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Your First Itinerary
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {trip.destination}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                      {trip.data.startDate}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <span className="mr-2">✈️</span>
                      <span className="truncate">
                        {trip.data.flight?.airline_name || "No flight selected"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🏨</span>
                      <span className="truncate">
                        {trip.data.hotel?.name || "No hotel selected"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🎭</span>
                      <span>
                        {trip.data.activities?.length || 0} Activities /{" "}
                        {trip.data.attractions?.length || 0} Attractions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex space-x-2">
                  <button
                    onClick={() =>
                      alert("Itinerary editing coming in Phase 3!")
                    }
                    className="flex-1 text-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="bg-white border border-red-200 text-red-500 p-2 rounded-lg hover:bg-red-50"
                    title="Delete Trip"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
