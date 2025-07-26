import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

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
  // Create custom icons
  const exactIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });

  const createLocationIcon = (index: number) => new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="15" fill="hsl(217 91% 60%)" stroke="white" stroke-width="3"/>
        <text x="15" y="20" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="12">${index + 1}</text>
      </svg>
    `),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  const center: LatLng = new LatLng(latitude || 45.464664, longitude || 9.188540);
  const zoom = latitude && longitude ? 14 : 2;

  const handleLocationClick = (location: any) => {
    onLocationSelect?.(location);
  };

  return (
    <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-design-md">
      <div className="w-full h-96 rounded-lg">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Exact coordinates marker */}
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={exactIcon}>
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
              key={index}
              position={[location.lat, location.lng]}
              icon={createLocationIcon(index)}
              eventHandlers={{
                click: () => handleLocationClick(location)
              }}
            >
              <Popup>
                <div className="text-sm p-2">
                  <strong>{location.name}</strong><br />
                  <span className="text-green-600">Confidenza: {location.confidence}%</span><br />
                  <small className="text-gray-500">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</small>
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