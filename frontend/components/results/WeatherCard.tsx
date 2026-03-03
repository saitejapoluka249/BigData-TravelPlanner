export default function WeatherCard({ weather }: { weather: any[] }) {
  // Mock total cost calculation for the UI based on the wireframe
  const estimatedCost = "$950";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-64 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-gray-800 mb-1 text-sm">Trip Summary & Weather</h3>
        <p className="text-xs text-gray-600 mb-4">Estimated Total Cost: ~{estimatedCost} (Budget)</p>
      </div>
      
      <div className="flex justify-between mt-auto">
        {weather?.slice(0, 5).map((day, idx) => (
          <div key={idx} className="flex flex-col items-center text-xs">
            <span className="font-medium mb-1">{day.dayOfWeek}</span>
            <span className="text-xl mb-1">{day.condition === 'Sunny' ? '☀️' : day.condition === 'Cloudy' ? '☁️' : '🌧️'}</span>
            <span className="font-semibold">{day.high}°</span>
            <span className="text-gray-500">{day.low}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}