import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Fix for default markers in Leaflet with React
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createNumberedIcon = (number: number, isSelected: boolean = false) => {
  const size = isSelected ? 42 : 30;
  const backgroundColor = isSelected ? 'hsl(217 91% 50%)' : 'hsl(217 91% 60%)';
  const borderWidth = isSelected ? '4px' : '3px';
  const boxShadow = isSelected
    ? '0 4px 16px rgba(0,0,0,0.4), 0 2px 8px rgba(59, 130, 246, 0.5)'
    : '0 2px 8px rgba(0,0,0,0.3)';
  const fontSize = isSelected ? '14px' : '12px';

  return L.divIcon({
    className: 'exact-location-marker',
    html: `<div style="
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

// Cerchio numerato per location NON selezionata
const createProbableLocationIcon = (index: number) => {
  return L.divIcon({
    className: 'location-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${backgroundColor};
      border: ${borderWidth} solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: ${fontSize};
      box-shadow: ${boxShadow};
      transition: all 0.3s ease;
      z-index: ${isSelected ? 1000 : 500};
    ">${number}</div>`,
    className: `numbered-marker ${isSelected ? 'selected' : ''}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Cerchio numerato per location SELEZIONATA (più grande, evidenziato)
const createSelectedLocationIcon = (index: number) => {
  return L.divIcon({
    className: 'selected-location-marker',
    html: `<div style="
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #2563eb;
      border: 4px solid #fbbf24;
      box-shadow: 0 0 14px 4px #fbbf24, 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: bold;
      font-size: 22px;
      transition: all 0.3s;
      z-index:1000;
    ">${index + 1}</div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

// Seleziona e centra la mappa sul luogo
const FlyToSelectedLocation: React.FC<{ selectedLocation?: any }> = ({ selectedLocation }) => {
  const map = useMap();
  const prev = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (selectedLocation && (
      !prev.current ||
      prev.current.lat !== selectedLocation.lat ||
      prev.current.lng !== selectedLocation.lng
    )) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 15, { duration: 1 });
      prev.current = { lat: selectedLocation.lat, lng: selectedLocation.lng };
    }
  }, [selectedLocation, map]);

  return null;
};

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  locations?: Array<{
    name: string;
    lat: number;
    lng: number;
    confidence: number;
  }>;
  selectedLocation?: {
    name: string;
    lat: number;
    lng: number;
  } | null;
  onLocationSelect?: (location: { name: string; lat: number; lng: number }) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  locations = [],
  selectedLocation,
  onLocationSelect
}) => {
  // Default center (Rome, Italy) if no coordinates provided
  const defaultCenter: [number, number] = [41.9028, 12.4964];

  // Use selected location coordinates if available, otherwise use provided coordinates, otherwise default
  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : latitude && longitude
    ? [latitude, longitude]
    : defaultCenter;

  const zoom = selectedLocation || (latitude && longitude) ? 14 : 6;

  return (
    <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-design-md">
      <div className="w-full h-96 rounded-lg" style={{ minHeight: '400px' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          className="w-full h-full rounded-lg"
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Probable locations markers */}
          {locations.map((location, index) => {
            const isSelected = selectedLocation &&
              selectedLocation.lat === location.lat &&
              selectedLocation.lng === location.lng &&
              selectedLocation.name === location.name;

            return (
              <Marker
                key={`${location.name}-${index}`}
                position={[location.lat, location.lng]}
                icon={createNumberedIcon(index + 1, isSelected)}
                eventHandlers={{
                  click: () => handleLocationClick(location),
                }}
              >
                <Popup>
                  <div className="text-sm p-2">
                    <strong>{location.name}</strong><br />
                    <span className="text-green-600">Confidenza: {location.confidence}%</span><br />
                    <small className="text-gray-500">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </small>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </Card>
  );
};

export default LocationMap;