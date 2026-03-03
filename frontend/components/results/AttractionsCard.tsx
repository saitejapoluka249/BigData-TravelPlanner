export default function AttractionsCard({ attractions }: { attractions: any[] }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-64 overflow-y-auto">
      <h3 className="font-bold text-gray-800 mb-3 text-sm">Places to Visit (Checklist)</h3>
      <div className="space-y-2">
        {attractions?.map((place, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id={`place-${idx}`} 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`place-${idx}`} className="text-sm text-gray-700 truncate w-full cursor-pointer">
              {place.name}
            </label>
          </div>
        ))}
        {(!attractions || attractions.length === 0) && <p className="text-sm text-gray-500">No attractions found.</p>}
      </div>
    </div>
  );
}