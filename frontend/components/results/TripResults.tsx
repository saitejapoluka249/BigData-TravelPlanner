"use client";
import React, { useState, useEffect } from "react";
import FlightCard from "./FlightCard";
import StaysCard from "./StayCard";
import WeatherCard from "./WeatherCard";
import AttractionsCard from "./AttractionCard";
import DrivingCard from "./DrivingCard";
import ToursCard from "./TourCard";
import { Loader2, Save, CheckCircle } from "lucide-react";

// 🌟 NEW IMPORTS FOR PHASE 2
import { useAuth } from "../../context/AuthContext";
import { travelApi } from "../../services/api";

type TabOption =
  | "flights"
  | "drive"
  | "stays"
  | "weather"
  | "attractions"
  | "tours";

const LoadingState = () => {
  const icons = ["✈️", "🚗", "🏨", "🎡", "🗺️", "☀️"];
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-100">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_75%,#4f46e5_100%)] animate-[spin_1.5s_linear_infinite]"></div>
        </div>
        <div className="absolute inset-[3px] bg-white rounded-[13px]"></div>
        <div className="z-10 text-4xl drop-shadow-sm transition-transform scale-110">
          {icons[iconIndex]}
        </div>
      </div>
      <h3 className="text-xl font-black text-gray-800 mt-4 animate-pulse">
        Crafting your itinerary...
      </h3>
      <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
        Searching routes, checking hotel availability, and gathering the best
        for you...
      </p>
    </div>
  );
};

export default function TripResults({
  data,
  loading,
}: {
  data: any;
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabOption>("flights");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const { isLoggedIn } = useAuth();

  const showFlights = data?.rawParams?.travelMode === "fly";
  const hasFlights = data?.flightData && data.flightData.length > 0;

  useEffect(() => {
    if (data && !loading) {
      const savedTab = sessionStorage.getItem("active_tab") as TabOption | null;
      if (savedTab) {
        setActiveTab(savedTab);
      } else if (showFlights && hasFlights) {
        setActiveTab("flights");
      } else {
        setActiveTab("drive");
      }
    }
  }, [data, loading, showFlights, hasFlights]);

  const handleTabChange = (tabId: TabOption) => {
    setActiveTab(tabId);
    sessionStorage.setItem("active_tab", tabId);
  };

  // 🌟 FIXED: HANDLE SAVE TRIP LOGIC
  const handleSaveTrip = async () => {
    if (!isLoggedIn) {
      alert("Please login to save this itinerary to your dashboard!");
      return;
    }

    setSaveStatus("saving");
    try {
      // 1. Grab the user's explicit selections from local storage!
      const savedState = localStorage.getItem("trip_state");
      const selections = savedState ? JSON.parse(savedState) : {};

      // 2. Build a clean payload using ONLY selected items
      const payload = {
        destination:
          data?.rawParams?.destination?.city ||
          data?.rawParams?.destination?.name ||
          "Trip",
        startDate: data?.rawParams?.startDate,
        endDate: data?.rawParams?.endDate,
        // Pull exclusively from the 'selections' object, defaulting to null/[] if empty
        flight: selections?.flights?.[0] || null,
        hotel: selections?.stays?.[0] || null,
        weather: data?.weather, // Weather applies to the whole trip, keep from raw data
        activities: selections?.tours || selections?.activities || [],
        attractions: selections?.attractions || [],
      };

      await travelApi.saveTrip(payload);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("idle");
      alert("Failed to save itinerary. Please try again.");
    }
  };

  if (!data && !loading) return null;
  if (loading) return <LoadingState />;

  const transportTab =
    showFlights && hasFlights
      ? { id: "flights", label: "Flights", icon: "✈️" }
      : { id: "drive", label: "Drive", icon: "🚗" };

  const tabs = [
    transportTab,
    { id: "stays", label: "Stays", icon: "🏨" },
    { id: "attractions", label: "Attractions", icon: "🎡" },
    { id: "tours", label: "Tours", icon: "🗺️" },
    { id: "weather", label: "Weather", icon: "☀️" },
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 mb-4 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">
            Your Custom Itinerary
          </h2>
          <p className="text-sm text-gray-500">
            Generated based on your preferences
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleSaveTrip}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              saveStatus === "saved"
                ? "bg-green-100 text-green-600 border border-green-200"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95"
            }`}
          >
            {saveStatus === "saving" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveStatus === "saved" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
              ? "Saved"
              : "Save Itinerary"}
          </button>
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-1 mb-4 border-b border-gray-200">
        <div className="flex w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabOption)}
                className={`flex-1 flex flex-col items-center py-3 transition-all relative group`}
              >
                <span
                  className={`text-lg mb-1 group-hover:scale-110 transition-transform ${
                    isActive ? "grayscale-0" : "grayscale opacity-70"
                  }`}
                >
                  {tab.icon}
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.3)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full min-h-[400px]">
        {activeTab === "flights" && (
          <FlightCard flights={data?.flightData || []} />
        )}
        {activeTab === "drive" && (
          <div className="flex flex-col gap-4">
            {showFlights && !hasFlights && (
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 flex items-center gap-3">
                <span className="text-xl">ℹ️</span>
                <p className="text-sm font-medium">
                  We couldn't find any flights for this route, so we're showing
                  you the best driving route instead!
                </p>
              </div>
            )}
            <DrivingCard drivingData={data?.drivingData || {}} />
          </div>
        )}
        {activeTab === "stays" && (
          <StaysCard stays={data?.stays || []} searchParams={data?.rawParams} />
        )}
        {activeTab === "attractions" && (
          <AttractionsCard attractions={data?.attractions || []} />
        )}
        {activeTab === "tours" && <ToursCard tours={data?.toursData || []} />}
        {activeTab === "weather" && <WeatherCard weather={data?.weather} />}
      </div>
    </div>
  );
}
