// larry6683/big-data-project-travel-app/frontend/components/results/AttractionsCard.tsx

import React from 'react';

export default function AttractionsCard({ attractions }: { attractions: any[] }) {
  if (!attractions || attractions.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold italic">
        No attractions found within the requested radius.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">📸 Nearby Attractions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {attractions.slice(0, 12).map((poi, idx) => {
          // Extract data safely depending on if it's Amadeus or OSM format
          const name = poi.name || poi.tags?.name || 'Interesting Place';
          const category = poi.category || poi.tags?.tourism || poi.tags?.amenity || 'Activity';
          
          return (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-colors shadow-sm flex flex-col justify-between h-full">
              <div>
                <h4 className="font-bold text-gray-800 mb-2 leading-tight" title={name}>{name}</h4>
                <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                  {category.replace(/_/g, ' ')}
                </span>
              </div>
              
              {poi.distance && (
                <p className="text-[11px] font-bold text-gray-400 mt-4 uppercase tracking-wider">
                  📍 {(poi.distance / 1609.34).toFixed(1)} miles away
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}