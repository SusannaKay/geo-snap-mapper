import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageRemove?: () => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onImageRemove, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File troppo grande",
          description: "Seleziona un'immagine inferiore a 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    disabled: isLoading
  });

  const clearImage = () => {
    setPreviewUrl(null);
    setDragActive(false);
    onImageRemove?.();
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/50 shadow-design-md transition-all duration-300 hover:shadow-design-lg">
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer transition-all duration-300 ease-smooth
          ${isDragActive || dragActive ? 'bg-accent/20 scale-[1.02]' : 'hover:bg-accent/10'}
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="bg-white/90 hover:bg-white text-foreground shadow-design-md"
              >
                <X className="w-4 h-4 mr-1" />
                Rimuovi
              </Button>
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Elaborazione in corso...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className={`
              mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 transition-all duration-200
              ${isDragActive || dragActive ? 'bg-accent/30 scale-110' : ''}
            `}>
              {isDragActive || dragActive ? (
                <ImageIcon className="w-8 h-8 text-accent" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive || dragActive ? 'Rilascia qui' : 'Carica la tua immagine'}
            </h3>
            
            <p className="text-muted-foreground mb-4">
              Trascina un'immagine qui o{' '}
              <span className="text-accent font-medium">sfoglia i file</span>
            </p>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Formati supportati: JPG, PNG</p>
              <p>Dimensione massima: 10MB</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageUpload;