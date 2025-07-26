import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  locations?: Array<{
    name: string;
    lat: number;
    lng: number;
    confidence: number;
  }>;
  onLocationSelect?: (location: { name: string; lat: number; lng: number }) => void;
}

// Create custom icons for different marker types
const createExactLocationIcon = () => {
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

const createProbableLocationIcon = (index: number) => {
  return L.divIcon({
    className: 'location-marker',
    html: `<div style="
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: hsl(217 91% 60%);
      border: 3px solid white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${index + 1}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  locations = [],
  onLocationSelect
}) => {
  // Determine map center and zoom
  const center: [number, number] = [latitude || 41.9028, longitude || 12.4964]; // Default to Rome
  const zoom = latitude && longitude ? 14 : 2;

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
          
          {/* Exact location marker */}
          {latitude && longitude && (
            <Marker
              position={[latitude, longitude]}
              icon={createExactLocationIcon()}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Posizione esatta</strong><br />
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Probable location markers */}
          {locations.map((location, index) => (
            <Marker
              key={`${location.lat}-${location.lng}-${index}`}
              position={[location.lat, location.lng]}
              icon={createProbableLocationIcon(index)}
              eventHandlers={{
                click: () => {
                  onLocationSelect?.(location);
                },
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
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default LocationMap;