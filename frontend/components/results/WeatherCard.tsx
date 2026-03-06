// larry6683/big-data-project-travel-app/frontend/components/results/WeatherCard.tsx

export default function WeatherCard({ weather }: { weather: any }) {
  if (!weather || (!weather.forecast && !weather.daily)) {
    return <div className="text-gray-500 italic">Weather data is currently unavailable for these dates.</div>;
  }

  const days = weather.forecast || weather.daily || [];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">⛅ Trip Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {days.map((day: any, idx: number) => (
          <div key={idx} className="min-w-[120px] border border-gray-200 rounded-lg p-4 text-center bg-blue-50/30">
            <p className="font-bold text-sm text-gray-700 mb-2">{day.date || day.day}</p>
            <div className="text-3xl mb-2">{day.icon || '🌤️'}</div>
            <p className="text-xs text-gray-500 capitalize mb-1">{day.description || day.condition}</p>
            <div className="flex justify-center gap-2 text-sm">
              <span className="font-bold text-red-500">{day.temp_max || day.high}°</span>
              <span className="font-bold text-blue-500">{day.temp_min || day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}