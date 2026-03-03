'use client'

import { useState, useEffect, useRef } from 'react';
import { travelApi, LocationResult } from '@/services/api';

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function LocationAutocomplete({ label, placeholder, value, onChange }: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce the Elasticsearch API calls so we don't spam the backend on every keystroke
  useEffect(() => {
    const fetchLocations = async () => {
      if (query.length > 1 && query !== value) {
        const data = await travelApi.searchLocations(query);
        setResults(data);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 300); // 300ms delay
    return () => clearTimeout(debounceTimer);
  }, [query, value]);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location: LocationResult) => {
    // Pass the IATA code or Name depending on what your other APIs need.
    // For Amadeus flights, we usually need the IATA code. 
    // You might want to pass back the exact string format your backend expects, e.g., "HYD"
    const selectedValue = location.iata ? location.iata : location.name;
    setQuery(selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setIsOpen(true)}
      />
      
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
          {results.map((loc, idx) => (
            <li 
              key={idx}
              className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
              onClick={() => handleSelect(loc)}
            >
              <div className="font-medium text-sm text-gray-800">{loc.name}</div>
              {loc.iata && <div className="text-xs text-gray-500 font-mono">{loc.iata}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}