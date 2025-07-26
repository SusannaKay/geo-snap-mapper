import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different marker types
const exactLocationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'exact-location-marker'
});

const createNumberedIcon = (number: number) => {
  return L.divIcon({
    html: `<div style="
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: hsl(217 91% 60%);
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${number}</div>`,
    className: 'numbered-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to handle map view updates
const MapViewController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
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
  onLocationSelect?: (location: { name: string; lat: number; lng: number }) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  locations = [],
  onLocationSelect
}) => {
  // Default center (Rome, Italy) if no coordinates provided
  const defaultCenter: [number, number] = [41.9028, 12.4964];
  const center: [number, number] = latitude && longitude ? [latitude, longitude] : defaultCenter;
  const zoom = latitude && longitude ? 14 : 6;

  const handleLocationClick = (location: { name: string; lat: number; lng: number }) => {
    onLocationSelect?.(location);
  };

  return (
    <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-design-md">
      <div className="w-full h-96" style={{ minHeight: '400px' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          {/* OpenStreetMap tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapViewController center={center} zoom={zoom} />

          {/* Exact location marker */}
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={exactLocationIcon}>
              <Popup>
                <div className="text-sm">
                  <strong>Posizione esatta</strong><br />
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Probable locations markers */}
          {locations.map((location, index) => (
            <Marker
              key={`${location.name}-${index}`}
              position={[location.lat, location.lng]}
              icon={createNumberedIcon(index + 1)}
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
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default LocationMap;