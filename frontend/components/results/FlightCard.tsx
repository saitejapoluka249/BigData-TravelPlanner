// larry6683/big-data-project-travel-app/frontend/components/results/FlightCard.tsx

export default function FlightCard({ flights }: { flights: any[] }) {
  if (!flights || flights.length === 0) {
    return <div className="text-gray-500 italic">No flights found for this route and date combination.</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">✈️ Top Flight Offers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flights.slice(0, 6).map((flight, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                {flight.airline || 'Airline'}
              </span>
              <span className="font-bold text-lg text-green-600">
                ${flight.price?.total || flight.price} {flight.price?.currency || 'USD'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Outbound:</strong> {flight.departure_time || 'Check Details'} ➔ {flight.arrival_time || 'Check Details'}</p>
              <p><strong>Class:</strong> {flight.travel_class || 'Economy'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}