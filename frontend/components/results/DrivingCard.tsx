// larry6683/big-data-project-travel-app/frontend/components/results/DrivingCard.tsx

export default function DrivingCard({ route }: { route: any }) {
  if (!route || route.length === 0 || route.error) {
    return <div className="text-gray-500 italic">No driving route data available for this trip.</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">🚗 Road Trip Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Distance</p>
          <p className="text-xl font-bold text-blue-900">{route.distance_miles?.toFixed(1) || 'N/A'} mi</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-xs text-green-500 font-bold uppercase tracking-wider mb-1">Est. Time</p>
          <p className="text-xl font-bold text-green-900">{route.duration_text || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}