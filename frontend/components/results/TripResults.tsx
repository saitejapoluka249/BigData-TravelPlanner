import FlightCard from './FlightCard';
import StayCard from './StayCard';
import WeatherCard from './WeatherCard';
import AttractionsCard from './AttractionsCard';

interface TripResultsProps {
  data: {
    flights: any[];
    stays: any[];
    weather: any[];
    attractions: any[];
  };
}

export default function TripResults({ data }: TripResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FlightCard flights={data.flights} />
      <StayCard stays={data.stays} />
      <WeatherCard weather={data.weather} />
      <AttractionsCard attractions={data.attractions} />
    </div>
  );
}