// larry6683/big-data-project-travel-app/frontend/components/results/TripResults.tsx

import React, { useState, useEffect } from 'react';
import FlightCard from './FlightCard';
import StaysCard from './StayCard';
import WeatherCard from './WeatherCard';
import AttractionsCard from './AttractionsCard';
import DrivingCard from './DrivingCard';
import ToursCard from './ToursCard'; // 🌟 NEW IMPORT

type TabOption = 'flights' | 'drive' | 'stays' | 'weather' | 'attractions' | 'tours';

export default function TripResults({ data, loading }: { data: any, loading: boolean }) {
  const [activeTab, setActiveTab] = useState<TabOption>('flights');

  // Pulling from the newly structured rawParams
  const showFlights = data?.rawParams?.travelMode === 'fly';
  const hasFlights = data?.flightData && data.flightData.length > 0;

  useEffect(() => {
    if (data && !loading) {
      if (showFlights && hasFlights) {
        setActiveTab('flights');
      } else {
        setActiveTab('drive');
      }
    }
  }, [data, loading, showFlights, hasFlights]);

  if (!data && !loading) return null;

  const transportTab = (showFlights && hasFlights) 
    ? { id: 'flights', label: 'Flights', icon: '✈️' }
    : { id: 'drive', label: 'Drive', icon: '🚗' };

  const tabs = [
    transportTab,
    { id: 'stays', label: 'Stays', icon: '🏨' },
    { id: 'attractions', label: 'Attractions', icon: '🎡' },
    { id: 'tours', label: 'Tours', icon: '🗺️' },
    { id: 'weather', label: 'Weather', icon: '☀️' },
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative mb-4">
        <div className="flex w-full border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabOption)}
                className={`flex-1 flex flex-col items-center py-4 transition-all relative group`}
              >
                <span className={`text-lg mb-1 group-hover:scale-110 transition-transform ${isActive ? 'grayscale-0' : 'grayscale opacity-70'}`}>
                  {tab.icon}
                </span>
                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.3)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full min-h-[400px]">
        {activeTab === 'flights' && (
          <FlightCard flights={data?.flightData || []}/>
        )}

        {activeTab === 'drive' && (
          <div className="flex flex-col gap-4">
            {showFlights && !hasFlights && (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 flex items-center gap-3">
                <span className="text-xl">ℹ️</span>
                <p className="text-sm font-medium">
                  We couldn't find any flights for this route, so we're showing you the best driving route instead!
                </p>
              </div>
            )}
            <DrivingCard drivingData={data?.drivingData || {}} />
          </div>
        )}
        
        {activeTab === 'stays' && (
          <StaysCard stays={data?.stays || []} />
        )}
        
        {activeTab === 'attractions' && (
          <AttractionsCard attractions={data?.attractions || []} />
        )}

        {/* 🌟 NEW TOURS TAB CONTENT */}
        {activeTab === 'tours' && (
          <ToursCard tours={data?.toursData || []} />
        )}
        
        {activeTab === 'weather' && (
          <WeatherCard weather={data?.weather} />
        )}
      </div>
    </div>
  );
}