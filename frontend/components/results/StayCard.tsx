export default function StayCard({ stays }: { stays: any[] }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-64 overflow-y-auto">
      <h3 className="font-bold text-gray-800 mb-3 text-sm">Stay Options (Amadeus Data)</h3>
      <div className="space-y-4">
        {stays?.map((stay, idx) => (
          <div key={idx} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
            <div className="text-blue-700 text-2xl">🛏️</div>
            <div>
              <p className="font-semibold text-sm">{stay.name}</p>
              <p className="text-xs text-gray-600">${stay.price}/night, {stay.distance} mi</p>
            </div>
          </div>
        ))}
        {(!stays || stays.length === 0) && <p className="text-sm text-gray-500">No stays found.</p>}
      </div>
    </div>
  );
}