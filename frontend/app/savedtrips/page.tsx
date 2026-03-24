// frontend/app/savedtrips/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { travelApi } from "../../services/api";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { X, Plane, Hotel, MapPin, Calendar, Map, Ticket } from "lucide-react";

interface SavedTrip {
  id: number;
  destination: string;
  data: {
    startDate: string;
    endDate: string;
    flight?: any;
    hotel?: any;
    weather?: any;
    activities?: any[];
    attractions?: any[];
  };
}

export default function SavedTripsPage() {
  const { isLoggedIn } = useAuth();
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);

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
      setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (error) {
      alert("Failed to delete trip.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const localDate = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2])
    );
    return localDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-theme-bg">
        <h1 className="text-2xl font-bold text-theme-text mb-4">
          Please login to view your saved trips
        </h1>
        <Link
          href="/auth"
          className="bg-theme-primary text-theme-bg px-6 py-2 rounded-lg hover:bg-theme-secondary transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg relative">
      <Navbar />

      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-theme-text tracking-tight">
              My Saved Itineraries
            </h1>
            <p className="text-theme-text/70 font-medium mt-1">
              You have {savedTrips.length} stored trips.
            </p>
          </div>
          <Link
            href="/"
            className="bg-theme-surface text-theme-primary px-4 py-2 rounded-lg font-bold hover:bg-theme-muted/20 transition-colors"
          >
            + Plan New Trip
          </Link>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="bg-theme-surface p-12 rounded-2xl shadow-sm text-center border border-theme-muted/30">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-theme-text mb-2">
              No trips planned yet
            </h3>
            <p className="text-theme-text/70 mb-6">
              Start exploring destinations and save your favorite itineraries
              here.
            </p>
            <Link
              href="/"
              className="bg-theme-primary text-theme-bg px-6 py-3 rounded-xl font-bold hover:bg-theme-secondary transition-colors"
            >
              Create Your First Itinerary
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-theme-surface rounded-2xl shadow-sm border border-theme-muted/30 overflow-hidden hover:shadow-md transition flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-black text-theme-text line-clamp-1">
                      {trip.destination}
                    </h2>
                    <span className="bg-theme-primary/10 text-theme-primary text-xs font-black px-2 py-1 rounded-md whitespace-nowrap border border-theme-primary/20">
                      {formatDate(trip.data.startDate)}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-theme-text/80 mb-6 font-medium">
                    <div className="flex items-center gap-2">
                      <Plane size={16} className="text-theme-muted" />
                      <span className="truncate">
                        {trip.data.flight?.airline_name || "No flight selected"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hotel size={16} className="text-theme-muted" />
                      <span className="truncate">
                        {trip.data.hotel?.name || "No hotel selected"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Map size={16} className="text-theme-muted" />
                      <span>
                        {trip.data.attractions?.length || 0} Attractions saved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-theme-bg border-t border-theme-muted/30 flex gap-2">
                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="flex-1 text-center bg-theme-surface border border-theme-muted/50 text-theme-text py-2 rounded-xl text-sm font-bold hover:bg-theme-muted/20 active:scale-95 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="bg-theme-surface border border-red-200 text-red-500 p-2 rounded-xl hover:bg-red-50 active:scale-95 transition"
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

      {/* ITINERARY DETAILS MODAL */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-theme-text/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedTrip(null)}
          />

          <div className="relative bg-theme-bg w-full max-w-2xl max-h-[85vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-theme-surface flex justify-between items-center bg-theme-surface/50">
              <div>
                <h2 className="text-xl font-black text-theme-text">
                  {selectedTrip.destination} Itinerary
                </h2>
                <p className="text-xs font-bold text-theme-text/60 uppercase tracking-widest mt-1">
                  <Calendar size={12} className="inline mr-1 mb-0.5" />
                  {formatDate(selectedTrip.data.startDate)} —{" "}
                  {formatDate(selectedTrip.data.endDate)}
                </p>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-2 hover:bg-theme-surface rounded-full transition bg-theme-bg text-theme-text/70"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-theme-bg">
              {/* Flight Info */}
              {selectedTrip.data.flight && (
                <div>
                  <h3 className="text-sm font-black text-theme-text/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Plane size={16} className="text-theme-primary" /> Flight
                  </h3>
                  <div className="bg-theme-primary/10 border border-theme-primary/20 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-theme-text">
                          {selectedTrip.data.flight.airline_name}
                        </p>
                        <p className="text-xs text-theme-text/60 mt-1">
                          {
                            selectedTrip.data.flight.itineraries?.[0]
                              ?.segments?.[0]?.departure_airport
                          }
                          {" → "}
                          {
                            selectedTrip.data.flight.itineraries?.[0]?.segments?.slice(
                              -1
                            )[0]?.arrival_airport
                          }
                        </p>
                      </div>
                      <span className="font-black text-theme-primary">
                        $
                        {selectedTrip.data.flight.price?.total ||
                          selectedTrip.data.flight.price ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel Info */}
              {selectedTrip.data.hotel && (
                <div>
                  <h3 className="text-sm font-black text-theme-text/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Hotel size={16} className="text-theme-primary" /> Accommodation
                  </h3>
                  <div className="bg-theme-primary/10 border border-theme-primary/20 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-theme-text">
                          {selectedTrip.data.hotel.name}
                        </p>
                        <p className="text-xs text-theme-text/60 mt-1 flex items-center gap-1">
                          <MapPin size={12} />{" "}
                          {selectedTrip.data.hotel.address?.lines?.join(", ") ||
                            "Address unavailable"}
                        </p>
                      </div>
                      <span className="font-black text-theme-primary">
                        $
                        {selectedTrip.data.hotel.offerDetails?.price ||
                          selectedTrip.data.hotel.price ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Attractions Info */}
              {selectedTrip.data.attractions &&
                selectedTrip.data.attractions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-theme-text/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Map size={16} className="text-theme-secondary" /> Attractions
                      to Visit
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTrip.data.attractions.map((attr, idx) => (
                        <div
                          key={idx}
                          className="bg-theme-surface border border-theme-muted/30 p-3 rounded-lg text-sm font-medium text-theme-text/80 flex items-start gap-2"
                        >
                          <span className="text-theme-secondary mt-0.5">•</span>{" "}
                          {attr.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-theme-surface bg-theme-surface/30">
              <button
                onClick={() => setSelectedTrip(null)}
                className="w-full bg-theme-text text-theme-bg font-bold py-3 rounded-xl hover:bg-theme-text/80 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}