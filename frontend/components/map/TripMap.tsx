'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'

// Fix for default Leaflet icon issues in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Custom icon for Stays (simulated with a different color/shape in a real app)
const stayIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface TripMapProps {
  mapData?: { lat: number; lng: number; radiusMiles: number; cityName: string };
  attractions?: Array<{ id: string; name: string; lat: number; lng: number }>;
  stays?: Array<{ id: string; name: string; price: number; lat: number; lng: number }>;
}

export default function TripMap({ mapData, attractions, stays }: TripMapProps) {
  // Default to center of US if no data
  const center: [number, number] = mapData ? [mapData.lat, mapData.lng] : [39.8283, -98.5795];
  const zoom = mapData ? 12 : 4;
  
  // Convert miles to meters for Leaflet Circle
  const radiusMeters = mapData ? mapData.radiusMiles * 1609.34 : 0;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer center={center} zoom={zoom} className="h-full w-full rounded-lg">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapData && (
          <>
            {/* Center Marker */}
            <Marker position={center} icon={defaultIcon}>
              <Popup className="font-bold">{mapData.cityName}</Popup>
            </Marker>

            {/* Radius Circle */}
            <Circle 
              center={center} 
              radius={radiusMeters} 
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} 
            />
          </>
        )}

        {/* Attractions Markers */}
        {attractions?.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]} icon={defaultIcon}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}

        {/* Stay Markers */}
        {stays?.map((stay) => (
          <Marker key={stay.id} position={[stay.lat, stay.lng]} icon={stayIcon}>
            <Popup>
              <strong>{stay.name}</strong><br/>
              ${stay.price} / night
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-[400]">
        <div className="flex items-center space-x-2 mb-2">
          <span className="w-4 h-4 rounded-full border border-blue-500 bg-blue-100 block"></span>
          <span className="text-sm">{mapData?.radiusMiles || 5} mil radius</span>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-blue-500 font-bold">📍</span>
          <span className="text-sm">Places of Interest</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-700 font-bold">🛏️</span>
          <span className="text-sm">Stay Options</span>
        </div>
      </div>
    </div>
  );
}