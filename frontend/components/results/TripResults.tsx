// larry6683/big-data-project-travel-app/frontend/components/results/TripResults.tsx

"use client";

import { useState } from 'react';
import FlightCard from './FlightCard';
import DrivingCard from './DrivingCard';
import StayCard from './StayCard';
import WeatherCard from './WeatherCard';
import AttractionsCard from './AttractionsCard';

interface TripResultsProps {
  data: {
    travelMode: 'fly' | 'drive';
    transportData: any;
    stays: any[];
    weather: any;
    attractions: any[];
  };
}

export default function TripResults({ data }: TripResultsProps) {
  const [activeTab, setActiveTab] = useState('transport');

  const tabs = [
    { id: 'transport', label: data.travelMode === 'drive' ? '🚗 Drive Route' : '✈️ Flights' },
    { id: 'stays', label: '🏨 Stays' },
    { id: 'weather', label: '⛅ Weather' },
    { id: 'attractions', label: '📸 Attractions' }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white border-b-2 border-blue-800'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
        {activeTab === 'transport' && data.travelMode === 'fly' && <FlightCard flights={data.transportData} />}
        {activeTab === 'transport' && data.travelMode === 'drive' && <DrivingCard route={data.transportData} />}
        {activeTab === 'stays' && <StayCard stays={data.stays} />}
        {activeTab === 'weather' && <WeatherCard weather={data.weather} />}
        {activeTab === 'attractions' && <AttractionsCard attractions={data.attractions} />}
      </div>
    </div>
  );
}