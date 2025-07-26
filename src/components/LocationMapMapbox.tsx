import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Placeholder token - users need to replace with their own
const MAPBOX_TOKEN = 'pk.your_mapbox_token_here';

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

const LocationMapMapbox: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  locations = [],
  onLocationSelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userToken, setUserToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  const initializeMap = useCallback((token: string) => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = token;
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude || 0, latitude || 0],
        zoom: latitude && longitude ? 14 : 2,
      });

      // Add navigation controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker for exact coordinates if available
      if (latitude && longitude) {
        new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="text-sm">
              <strong>Posizione esatta</strong><br>
              ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
            </div>
          `))
          .addTo(mapInstance);
      }

      // Add markers for probable locations
      locations.forEach((location, index) => {
        const el = document.createElement('div');
        el.className = 'location-marker';
        el.style.cssText = `
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
        `;
        el.textContent = (index + 1).toString();

        el.addEventListener('click', () => {
          onLocationSelect?.(location);
          mapInstance.flyTo({
            center: [location.lng, location.lat],
            zoom: 14,
            duration: 1000
          });
        });

        new mapboxgl.Marker(el)
          .setLngLat([location.lng, location.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="text-sm p-2">
              <strong>${location.name}</strong><br>
              <span class="text-green-600">Confidenza: ${location.confidence}%</span><br>
              <small class="text-gray-500">${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</small>
            </div>
          `))
          .addTo(mapInstance);
      });

      map.current = mapInstance;
      setMapInitialized(true);
      setShowTokenInput(false);
      
    } catch (error) {
      toast({
        title: "Errore inizializzazione mappa",
        description: "Verifica che il token Mapbox sia valido",
        variant: "destructive",
      });
    }
  }, [latitude, longitude, locations, onLocationSelect]);

  const handleTokenSubmit = () => {
    if (!userToken.trim()) {
      toast({
        title: "Token richiesto",
        description: "Inserisci il tuo token Mapbox per visualizzare la mappa",
        variant: "destructive",
      });
      return;
    }
    initializeMap(userToken);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50 shadow-design-md">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
            <Settings className="w-6 h-6 text-accent" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Configura Mapbox</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Per visualizzare la mappa interattiva, inserisci il tuo token Mapbox pubblico.
              <br />
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Ottieni il token su mapbox.com
              </a>
            </p>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwicmVmcmVzaCImIjoiMzAiLCJuZXciOiJmYWxzZSI..."
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
              className="text-sm"
            />
            <Button 
              onClick={handleTokenSubmit}
              className="w-full"
              disabled={!userToken.trim()}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Inizializza Mappa
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-design-md">
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-lg"
        style={{ minHeight: '400px' }}
      />
      {!mapInitialized && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Caricamento mappa...</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LocationMapMapbox;