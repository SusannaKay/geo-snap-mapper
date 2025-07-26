import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp } from 'lucide-react';

interface LocationOption {
  name: string;
  lat: number;
  lng: number;
  confidence: number;
  description?: string;
}

interface LocationOptionsProps {
  locations: LocationOption[];
  onLocationSelect: (location: LocationOption) => void;
  selectedLocation?: LocationOption;
}

const LocationOptions: React.FC<LocationOptionsProps> = ({
  locations,
  onLocationSelect,
  selectedLocation
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-success text-success-foreground';
    if (confidence >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return '🎯';
    if (confidence >= 60) return '📍';
    return '❓';
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-design-md">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Posizioni Probabili</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Basato su analisi AI e riconoscimento visuale dell'immagine
      </p>

      <div className="space-y-3">
        {locations.map((location, index) => (
          <div
            key={`${location.name}-${index}`}
            className={`
              relative p-4 border rounded-lg transition-all duration-200 cursor-pointer
              ${selectedLocation?.name === location.name
                ? 'border-accent bg-accent/10 shadow-design-md'
                : 'border-border hover:border-accent/50 hover:bg-accent/5'
              }
            `}
            onClick={() => onLocationSelect(location)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{getConfidenceIcon(location.confidence)}</span>
                  <h4 className="font-medium truncate">{location.name}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getConfidenceColor(location.confidence)}`}
                  >
                    {location.confidence}%
                  </Badge>
                </div>
                
                {location.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {location.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Lat: {location.lat.toFixed(4)}</span>
                  <span>Lng: {location.lng.toFixed(4)}</span>
                </div>
              </div>

              <Button
                variant={selectedLocation?.name === location.name ? "default" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onLocationSelect(location);
                }}
              >
                <MapPin className="w-3 h-3 mr-1" />
                {selectedLocation?.name === location.name ? 'Selezionata' : 'Visualizza'}
              </Button>
            </div>

            {selectedLocation?.name === location.name && (
              <div className="absolute inset-0 pointer-events-none border-2 border-accent rounded-lg animate-pulse-glow"></div>
            )}
          </div>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nessuna posizione probabile identificata</p>
        </div>
      )}
    </Card>
  );
};

export default LocationOptions;