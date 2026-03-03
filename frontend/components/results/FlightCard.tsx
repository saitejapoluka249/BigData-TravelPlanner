export default function FlightCard({ flights }: { flights: any[] }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-64 overflow-y-auto">
      <h3 className="font-bold text-gray-800 mb-3 text-sm">Live Flight Options (Amadeus Data)</h3>
      <div className="space-y-4">
        {flights?.map((flight, idx) => (
          <div key={idx} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
            <div className="text-blue-600 text-2xl">✈️</div>
            <div>
              <p className="font-semibold text-sm">{flight.airline}</p>
              <p className="text-xs text-gray-600">${flight.price}, {flight.duration}</p>
            </div>
          </div>
        ))}
        {(!flights || flights.length === 0) && <p className="text-sm text-gray-500">No flights found.</p>}
      </div>
    </div>
  );
}