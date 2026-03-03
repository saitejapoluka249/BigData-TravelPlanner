"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Users, Calendar, Wallet } from "lucide-react";
import Cookies from "js-cookie";

interface LocationResult {
  city: string;
  state: string;
  lat: number;
  lon: number;
}

export default function Sidebar() {
  // Global State parameters
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState("mid-range");
  
  // UI states
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [activeField, setActiveField] = useState<"source" | "dest" | null>(null);

  // 1. GPS Nearest City Detection
  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Hits the nearest city endpoint we added to the backend
          const res = await fetch(`http://localhost:8000/api/v1/locations/nearest?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.city) {
            setSource(`${data.city}, ${data.state || ""}`);
          }
        } catch (err) {
          console.error("GPS detection failed:", err);
        }
      });
    }
  };

  // 2. Elasticsearch Autocomplete
  const fetchCities = async (query: string, type: "source" | "dest") => {
    setActiveField(type);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      // Hits the Elasticsearch-backed search endpoint
      const res = await fetch(`http://localhost:8000/api/v1/locations/search?keyword=${query}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Autocomplete failed:", err);
    }
  };

  // 3. Save State to Cookies & Global State
  const handleSearchSubmit = () => {
    const startDate = new Date(dates.start);
    const endDate = new Date(dates.end);
    const numNights = Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    const searchState = {
      source,
      destination,
      dates,
      numNights,
      adults,
      children,
      budget,
      timestamp: new Date().toISOString()
    };

    // Store in cookie for Trip Generator service
    Cookies.set("search_state", JSON.stringify(searchState), { expires: 7 });
    console.log("Global State Updated:", searchState);
    
    // Trigger backend trending update
    fetch("http://localhost:8000/api/v1/locations/trending", { method: "GET" });
  };

  return (
    <div className="w-80 h-screen bg-black text-white p-6 flex flex-col gap-6 border-r border-zinc-800">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Search size={20} /> Plan Your Trip
      </h2>

      {/* Source Input with GPS */}
      <div className="relative">
        <label className="text-xs text-zinc-500 font-bold uppercase">From</label>
        <div className="flex items-center bg-zinc-900 rounded p-2 mt-1 border border-transparent focus-within:border-blue-500">
          <MapPin size={16} className="text-blue-400 mr-2" />
          <input 
            value={source}
            onChange={(e) => { setSource(e.target.value); fetchCities(e.target.value, "source"); }}
            placeholder="City, State" 
            className="bg-transparent outline-none w-full text-sm"
          />
          <button onClick={handleGPS} className="text-[10px] bg-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-500">GPS</button>
        </div>
        {activeField === "source" && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-zinc-900 border border-zinc-700 mt-1 rounded shadow-xl max-h-40 overflow-y-auto">
            {suggestions.map((loc, i) => (
              <li key={i} onClick={() => { setSource(`${loc.city}, ${loc.state}`); setSuggestions([]); }} className="p-2 text-sm hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-0">
                {loc.city}, {loc.state}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destination Input */}
      <div className="relative">
        <label className="text-xs text-zinc-500 font-bold uppercase">To</label>
        <div className="flex items-center bg-zinc-900 rounded p-2 mt-1 border border-transparent focus-within:border-green-500">
          <MapPin size={16} className="text-green-400 mr-2" />
          <input 
            value={destination}
            onChange={(e) => { setDestination(e.target.value); fetchCities(e.target.value, "dest"); }}
            placeholder="Where to?" 
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
        {activeField === "dest" && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-zinc-900 border border-zinc-700 mt-1 rounded shadow-xl max-h-40 overflow-y-auto">
            {suggestions.map((loc, i) => (
              <li key={i} onClick={() => { setDestination(`${loc.city}, ${loc.state}`); setSuggestions([]); }} className="p-2 text-sm hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-0">
                {loc.city}, {loc.state}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-zinc-500 font-bold uppercase">Start</label>
          <input type="date" className="bg-zinc-900 w-full p-2 rounded mt-1 text-xs border border-zinc-800" onChange={(e) => setDates({...dates, start: e.target.value})} />
        </div>
        <div>
          <label className="text-xs text-zinc-500 font-bold uppercase">End</label>
          <input type="date" className="bg-zinc-900 w-full p-2 rounded mt-1 text-xs border border-zinc-800" onChange={(e) => setDates({...dates, end: e.target.value})} />
        </div>
      </div>

      {/* Travelers */}
      <div className="flex justify-between items-center bg-zinc-900 p-3 rounded border border-zinc-800">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-zinc-400" />
          <input type="number" value={adults} min={1} onChange={(e) => setAdults(parseInt(e.target.value))} className="bg-transparent w-8 text-sm outline-none font-bold" />
          <span className="text-[10px] text-zinc-500 uppercase">Adults</span>
        </div>
        <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
          <input type="number" value={children} min={0} onChange={(e) => setChildren(parseInt(e.target.value))} className="bg-transparent w-8 text-sm outline-none font-bold" />
          <span className="text-[10px] text-zinc-500 uppercase">Kids</span>
        </div>
      </div>

      {/* Budget Selector */}
      <div>
        <label className="text-xs text-zinc-500 font-bold uppercase flex items-center gap-1">
          <Wallet size={12}/> Budget Category
        </label>
        <select 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)}
          className="bg-zinc-900 w-full p-2 rounded mt-1 text-sm outline-none border border-zinc-800"
        >
          <option value="economy">Economy</option>
          <option value="mid-range">Mid-Range</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      <button 
        onClick={handleSearchSubmit}
        className="mt-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
      >
        Generate Itinerary
      </button>
    </div>
  );
}