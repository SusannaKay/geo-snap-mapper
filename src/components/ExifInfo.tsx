import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Camera, MapPin, Info } from 'lucide-react';

interface ExifData {
  dateTime?: string;
  camera?: {
    make?: string;
    model?: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  technical?: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
  };
}

interface ExifInfoProps {
  exifData: ExifData;
}

const ExifInfo: React.FC<ExifInfoProps> = ({ exifData }) => {
  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-design-md">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Informazioni Immagine</h3>
      </div>

      <div className="space-y-4">
        {/* Data e ora */}
        {exifData.dateTime && (
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium">Data di scatto</p>
              <p className="text-sm text-muted-foreground">{exifData.dateTime}</p>
            </div>
          </div>
        )}

        {/* Fotocamera */}
        {(exifData.camera?.make || exifData.camera?.model) && (
          <div className="flex items-start gap-3">
            <Camera className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium">Fotocamera</p>
              <p className="text-sm text-muted-foreground">
                {[exifData.camera.make, exifData.camera.model]
                  .filter(Boolean)
                  .join(' ')}
              </p>
            </div>
          </div>
        )}

        {/* Coordinate GPS */}
        {exifData.coordinates && (
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium">Coordinate GPS</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Lat: {exifData.coordinates.latitude.toFixed(6)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Lng: {exifData.coordinates.longitude.toFixed(6)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Dati tecnici */}
        {exifData.technical && Object.values(exifData.technical).some(Boolean) && (
          <div>
            <p className="text-sm font-medium mb-2">Dati tecnici</p>
            <div className="grid grid-cols-2 gap-2">
              {exifData.technical.aperture && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Apertura:</span>
                  <span className="ml-1 font-medium">{exifData.technical.aperture}</span>
                </div>
              )}
              {exifData.technical.shutterSpeed && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Velocità:</span>
                  <span className="ml-1 font-medium">{exifData.technical.shutterSpeed}</span>
                </div>
              )}
              {exifData.technical.iso && (
                <div className="text-xs">
                  <span className="text-muted-foreground">ISO:</span>
                  <span className="ml-1 font-medium">{exifData.technical.iso}</span>
                </div>
              )}
              {exifData.technical.focalLength && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Focale:</span>
                  <span className="ml-1 font-medium">{exifData.technical.focalLength}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExifInfo;