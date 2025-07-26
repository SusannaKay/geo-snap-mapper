## API Endpoint Expected by the Frontend

The application expects **one primary API endpoint**:

### `POST /api/process-image`

**Purpose**: Process uploaded images to extract EXIF metadata and perform AI-based location analysis.

**Request Format**:
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: FormData containing:
  - `image`: The uploaded image file

**Expected Response Format** (JSON):
```json
{
  "exifData": {
    "dateTime": "2024-07-15 14:30:22",
    "camera": {
      "make": "Apple", 
      "model": "iPhone 14 Pro"
    },
    "coordinates": {
      "latitude": 48.8584,
      "longitude": 2.2945
    },
    "technical": {
      "aperture": "f/1.78",
      "shutterSpeed": "1/120", 
      "iso": "64",
      "focalLength": "6.9mm"
    }
  },
  "probableLocations": [
    {
      "name": "Torre Eiffel, Parigi",
      "lat": 48.8584,
      "lng": 2.2945,
      "confidence": 92,
      "description": "Iconica torre di ferro a Parigi, Francia"
    },
    {
      "name": "Champ de Mars, Parigi", 
      "lat": 48.8556,
      "lng": 2.2986,
      "confidence": 78,
      "description": "Parco pubblico vicino alla Torre Eiffel"
    }
  ],
  "message": "Analisi completata con successo"
}
```

**Response Structure Details**:

- **`exifData`** (optional): Contains extracted EXIF metadata
  - `dateTime`: Image capture timestamp
  - `camera`: Camera manufacturer and model
  - `coordinates`: GPS coordinates if available in EXIF
  - `technical`: Camera settings (aperture, shutter speed, ISO, focal length)

- **`probableLocations`** (optional): Array of AI-detected possible locations
  - `name`: Human-readable location name
  - `lat`/`lng`: Geographical coordinates  
  - `confidence`: Confidence percentage (0-100)
  - `description`: Optional location description

- **`message`** (optional): Status or informational message

**Current Status**: The frontend currently falls back to mock data when the API call fails, indicating the backend is not yet implemented. The application shows a toast message: "Utilizzo dati di esempio - il backend non è ancora configurato" (Using example data - backend not yet configured).

This is the only API endpoint the application requires to function fully.