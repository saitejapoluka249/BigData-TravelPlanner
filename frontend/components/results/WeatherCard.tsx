import React, { useState, useEffect } from 'react';

export default function WeatherCard({ weather }: { weather: any }) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    const tripStateStr = localStorage.getItem('trip_state');
    if (tripStateStr) {
      try {
        const tripState = JSON.parse(tripStateStr);
        if (tripState.weather && tripState.weather.selected) {
          setIsSelected(true);
        } else {
          setIsSelected(false);
        }
      } catch (e) {
        console.error("Error parsing trip_state localStorage:", e);
      }
    }
  }, [weather]);

  const toggleWeatherSelection = () => {
    const tripStateStr = localStorage.getItem('trip_state');
    let tripState = tripStateStr ? JSON.parse(tripStateStr) : {};
    
    const newSelected = !isSelected;
    setIsSelected(newSelected);

    tripState.weather = newSelected ? { selected: true, data: weather } : null;
    localStorage.setItem('trip_state', JSON.stringify(tripState));
  };

  if (!weather || !weather.days || weather.days.length === 0) {
    return (
      <div className="p-8 text-center bg-theme-surface border border-dashed border-theme-surface rounded-2xl text-theme-text/70 font-bold italic">
        Weather data is currently unavailable for these dates.
      </div>
    );
  }

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sun')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('thunder') || desc.includes('storm')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '⛅';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 p-5 ${isSelected ? 'border-theme-primary ring-1 ring-theme-primary bg-theme-primary/10 shadow-sm' : 'border-theme-surface bg-theme-bg hover:border-theme-muted hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-black text-theme-text tracking-tight">Trip Forecast</h3>
        
        <label className="flex items-center gap-2 cursor-pointer bg-theme-bg text-theme-text px-4 py-2 rounded-lg hover:bg-theme-surface border border-theme-surface transition-colors shadow-sm shrink-0">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => toggleWeatherSelection()} 
            className="w-4 h-4 accent-theme-primary cursor-pointer" 
          />
          <span className="text-xs font-bold text-theme-text/80 select-none w-[56px] inline-block text-center">
            {isSelected ? 'Selected' : 'Select'}
          </span>
        </label>

      </div>
      
      {weather.overall_summary && (
        <div className="mb-6 p-4 bg-theme-muted/20 border border-theme-muted rounded-lg text-theme-primary text-sm font-medium">
          ℹ️ {weather.overall_summary}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {weather.days.map((day: any, idx: number) => (
          <div key={idx} className="border border-theme-surface rounded-xl p-4 bg-theme-surface transition-colors shadow-sm flex flex-row items-center justify-between gap-4 hover:border-theme-muted">
            
            <div className="flex items-center gap-4">
              <div className="text-4xl drop-shadow-sm shrink-0">
                {getWeatherIcon(day.weather)}
              </div>
              <div className="flex flex-col">
                <p className="font-black text-sm text-theme-text uppercase tracking-wider mb-1">
                  {formatDate(day.date)}
                </p>
                <p className="text-[11px] text-theme-text/70 font-bold uppercase leading-tight">
                  {day.weather}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-theme-accent font-bold uppercase mb-0.5">High</span>
                <span className="font-black text-theme-accent text-lg sm:text-xl leading-none">
                  {Math.round(day.max_temp)}°
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-theme-muted font-bold uppercase mb-0.5">Low</span>
                <span className="font-black text-theme-secondary text-lg sm:text-xl leading-none">
                  {Math.round(day.min_temp)}°
                </span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}