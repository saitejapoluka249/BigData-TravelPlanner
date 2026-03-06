// larry6683/big-data-project-travel-app/frontend/components/results/AttractionsCard.tsx

export default function AttractionsCard({ attractions }: { attractions: any[] }) {
  if (!attractions || attractions.length === 0) {
    return <div className="text-gray-500 italic">No attractions found within the requested radius.</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">📸 Nearby Attractions & Activities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {attractions.slice(0, 9).map((poi, idx) => {
          // Extract data safely depending on if it's Amadeus or OSM format
          const name = poi.name || poi.tags?.name || 'Interesting Place';
          const category = poi.category || poi.tags?.tourism || poi.tags?.amenity || 'Activity';
          
          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-800 mb-1 truncate" title={name}>{name}</h4>
              <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {category.replace(/_/g, ' ')}
              </span>
              {poi.distance && (
                <p className="text-xs text-gray-500 mt-2">📍 {(poi.distance / 1609.34).toFixed(1)} miles away</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}