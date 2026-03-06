// larry6683/big-data-project-travel-app/frontend/components/results/StayCard.tsx

export default function StayCard({ stays }: { stays: any[] }) {
  if (!stays || stays.length === 0) {
    return <div className="text-gray-500 italic">No available stays found for these dates.</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">🏨 Available Hotels</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stays.slice(0, 6).map((stay, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-800 truncate mb-1" title={stay.name}>{stay.name}</h4>
            <p className="text-xs text-gray-500 mb-2 truncate">{stay.address || 'Location unavailable'}</p>
            
            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                {stay.rating ? `⭐ ${stay.rating}/5` : 'No Rating'}
              </span>
              {stay.price && (
                <span className="font-bold text-green-600">${stay.price}/night</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}