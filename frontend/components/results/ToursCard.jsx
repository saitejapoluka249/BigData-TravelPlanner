// larry6683/big-data-project-travel-app/frontend/components/results/ToursCard.tsx

import React from 'react';

export default function ToursCard({ tours }) {
  if (!tours || tours.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold italic">
        No specific tours or guided experiences found for this destination.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">🗺️ Local Tours & Experiences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tours.map((tour, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm flex gap-4">
            
            {/* Tour Image or Placeholder */}
            {tour.picture_url ? (
              <img src={tour.picture_url} alt={tour.name} className="w-24 h-24 object-cover rounded-lg shrink-0 shadow-sm border border-gray-200" />
            ) : (
              <div className="w-24 h-24 bg-blue-100 text-blue-400 flex items-center justify-center rounded-lg shrink-0 shadow-sm text-3xl border border-blue-200">
                🎟️
              </div>
            )}
            
            <div className="flex flex-col flex-1 justify-between overflow-hidden">
              <div>
                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate" title={tour.name}>
                  {tour.name}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed" title={tour.short_description}>
                  {tour.short_description || "Experience the best of the local culture and sights with this guided activity."}
                </p>
              </div>
              
              <div className="flex items-end justify-between mt-3 pt-2 border-t border-gray-200/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {tour.minimum_duration ? `⏱️ ${tour.minimum_duration}` : 'Flexible duration'}
                </span>
                
                {tour.price && (
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm">
                    {tour.currency === 'USD' ? '$' : tour.currency === 'EUR' ? '€' : tour.currency}
                    {tour.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}