# Google Maps Platform Integration Guide

Complete setup for real Google Maps integration.

## 🗺️ Getting Started

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a Project" → "New Project"
3. Enter project name: "DriveFuel"
4. Click "Create"
5. Wait for project to be created

### Step 2: Enable APIs

In the Cloud Console, search for and enable these APIs:

**Required APIs:**
- [x] Maps JavaScript API
- [x] Directions API
- [x] Distance Matrix API
- [x] Geocoding API
- [x] Places API
- [x] Maps Embed API

**Steps to enable:**
1. Search for API name
2. Click on the API
3. Click "Enable"
4. Repeat for each API

### Step 3: Create API Key

1. Go to "Credentials" in left menu
2. Click "Create Credentials" → "API Key"
3. A new API key will be created (looks like: `AIzaSy...`)
4. Click the edit icon → rename to "DriveFuel Web Key"
5. Configure restrictions:
   - **Application restrictions**: HTTP referrers (web sites)
   - **API restrictions**: Select the APIs above
   - **HTTP referrers**: Add your domains:
     ```
     localhost:3000
     localhost:3001
     yourdomain.com
     *.yourdomain.com
     yourvercelapp.vercel.app
     ```

### Step 4: Add to Environment

```bash
# Update .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Step 5: Billing Setup

⚠️ **Important**: Enable billing to use APIs beyond free tier

1. Go to "Billing" in Cloud Console
2. Create billing account
3. Enable free trial ($300 credit)
4. Set budget alerts

**Pricing (estimated):**
- Geocoding: $0.005 per request (50K free/month)
- Directions: $0.01 per request (50K free/month)
- Distance Matrix: $0.01 per request
- Places: $0.032 per request
- Total estimated: ~$500-1000/month at scale

---

## 🔧 Switching from Mock to Real API

### Current Implementation (Mock)

The app currently uses simulated data in `app/services/googleMapsService.ts`:

```typescript
// Mock implementation
const mockGeocodes = {
  'Islamabad': { lat: 33.7294, lng: 73.1883 },
  'Lahore': { lat: 31.5204, lng: 74.3587 },
  // ...
}
```

### Real Implementation

Replace mock functions with actual API calls:

#### 1. Install Google Maps Client

```bash
npm install @googlemaps/js-api-loader axios
```

#### 2. Update Geocoding Function

```typescript
// app/services/googleMapsService.ts

import axios from 'axios'

export async function geocodeAddress(address: string): Promise<Location | null> {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    )

    const result = response.data.results[0]
    if (!result) return null

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      address: result.formatted_address,
      placeId: result.place_id,
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
```

#### 3. Update Route Calculation

```typescript
export async function calculateRoute(
  start: Location,
  end: Location,
  options?: any
): Promise<RouteInfo | null> {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/directions/json',
      {
        params: {
          origin: `${start.lat},${start.lng}`,
          destination: `${end.lat},${end.lng}`,
          mode: options?.mode || 'driving',
          alternatives: options?.alternatives || true,
          traffic_model: 'best_guess',
          departure_time: 'now',
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    )

    const route = response.data.routes[0]
    const leg = route.legs[0]

    return {
      distance: leg.distance.value, // meters
      duration: leg.duration.value, // seconds
      trafficDuration: leg.duration_in_traffic?.value, // with traffic
      polyline: route.overview_polyline.points,
      steps: leg.steps.map((step: any) => ({
        distance: step.distance.value,
        duration: step.duration.value,
        instruction: step.html_instructions,
        location: {
          lat: step.start_location.lat,
          lng: step.start_location.lng,
        },
      })),
    }
  } catch (error) {
    console.error('Route calculation error:', error)
    return null
  }
}
```

#### 4. Update Fuel Station Finder

```typescript
export async function findNearbyFuelStations(
  location: Location,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: radiusMeters,
          type: 'gas_station',
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    )

    return response.data.results.map((place: any) => ({
      name: place.name,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      address: place.vicinity,
      placeId: place.place_id,
      rating: place.rating,
      distance: calculateDistance(location, {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      }),
      openNow: place.opening_hours?.open_now,
    }))
  } catch (error) {
    console.error('Fuel station search error:', error)
    return []
  }
}
```

#### 5. Update EV Charging Stations

```typescript
export async function findNearbyChargingStations(
  location: Location,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  try {
    // Search for multiple charging-related keywords
    const keywords = ['ev_charging_station', 'electric_vehicle_charging_station']
    const allResults: NearbyPlace[] = []

    for (const keyword of keywords) {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        {
          params: {
            query: `${keyword} near ${location.lat},${location.lng}`,
            radius: radiusMeters,
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          },
        }
      )

      response.data.results.forEach((place: any) => {
        allResults.push({
          name: place.name,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          address: place.formatted_address,
          placeId: place.place_id,
          distance: calculateDistance(location, {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          }),
        })
      })
    }

    // Remove duplicates and sort by distance
    return allResults
      .reduce((unique: NearbyPlace[], place) => {
        if (!unique.find((u) => u.placeId === place.placeId)) {
          unique.push(place)
        }
        return unique
      }, [])
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)
  } catch (error) {
    console.error('Charging station search error:', error)
    return []
  }
}
```

---

## 📍 Display Map on Frontend

### Using Google Maps JavaScript API

```tsx
// app/components/MapDisplay.tsx

'use client'

import { useEffect, useRef } from 'react'

interface MapDisplayProps {
  startLocation: { lat: number; lng: number }
  endLocation: { lat: number; lng: number }
  polyline?: string
}

export function MapDisplay({
  startLocation,
  endLocation,
  polyline,
}: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    mapInstance.current = new google.maps.Map(mapRef.current, {
      zoom: 8,
      center: startLocation,
      mapTypeControl: false,
    })

    // Add start marker
    new google.maps.Marker({
      position: startLocation,
      map: mapInstance.current,
      title: 'Start',
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    })

    // Add end marker
    new google.maps.Marker({
      position: endLocation,
      map: mapInstance.current,
      title: 'End',
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    })

    // Draw route polyline
    if (polyline) {
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline)
      new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#0ea5e9',
        strokeOpacity: 0.7,
        strokeWeight: 3,
        map: mapInstance.current,
      })

      // Fit to bounds
      const bounds = new google.maps.LatLngBounds()
      decodedPath.forEach((point) => bounds.extend(point))
      mapInstance.current.fitBounds(bounds)
    }
  }, [startLocation, endLocation, polyline])

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border border-slate-200 dark:border-slate-700"
    />
  )
}
```

### Add to Trip Analysis Card

```tsx
// In TripAnalysisCard.tsx

import { MapDisplay } from './MapDisplay'

// In component render:
<MapDisplay
  startLocation={{ lat: analysis.startLat, lng: analysis.startLng }}
  endLocation={{ lat: analysis.destLat, lng: analysis.destLng }}
  polyline={analysis.routePolyline}
/>
```

---

## 🔐 API Security

### Rate Limiting

```typescript
// app/middleware.ts

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip || '')

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

### Request Validation

```typescript
// Validate API calls to prevent abuse
const validateGeocode = (address: string) => {
  if (!address || address.length > 200) {
    throw new Error('Invalid address')
  }
  // Add more validation
}
```

---

## 💰 Cost Optimization

### Tips to Reduce Costs

1. **Cache Results**
   ```typescript
   const cache = new Map()
   
   export async function geocodeAddress(address: string) {
     if (cache.has(address)) {
       return cache.get(address)
     }
     // Call API
     const result = await realGeocode(address)
     cache.set(address, result)
     return result
   }
   ```

2. **Batch Requests**
   - Use Distance Matrix API instead of multiple Directions API calls
   - Combine multiple queries in one request

3. **Use Client-Side Geocoding**
   - For local searches, use Places Autocomplete widget
   - Reduces server-side API calls

4. **Set Request Limits**
   - Disable unnecessary APIs
   - Use `http referers` restriction to prevent abuse

5. **Monitor Usage**
   ```bash
   # Check monthly costs in Google Cloud Console
   # Set up billing alerts
   # View API usage in Google Cloud Billing
   ```

---

## 🧪 Testing

### Test Coordinates

```typescript
const testCases = [
  {
    start: { lat: 33.7294, lng: 73.1883 },    // Islamabad
    end: { lat: 31.5204, lng: 74.3587 },      // Lahore
    expectedDistance: 374, // km
  },
  {
    start: { lat: 31.5204, lng: 74.3587 },    // Lahore
    end: { lat: 24.8607, lng: 67.0011 },      // Karachi
    expectedDistance: 1200, // km
  },
]
```

### API Response Testing

```bash
# Test Geocoding
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Islamabad&key=YOUR_KEY"

# Test Directions
curl "https://maps.googleapis.com/maps/api/directions/json?origin=33.7294,73.1883&destination=31.5204,74.3587&key=YOUR_KEY"

# Test Places
curl "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=33.7294,73.1883&radius=5000&type=gas_station&key=YOUR_KEY"
```

---

## 🐛 Troubleshooting

### API Not Working

1. **Check API is enabled**
   ```bash
   # In Google Cloud Console, verify APIs are "Enabled"
   ```

2. **Verify API Key**
   ```bash
   # Check key is correct in .env.local
   echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   ```

3. **Check Restrictions**
   - HTTP referrer matches your domain
   - APIs are restricted to necessary ones

4. **Check Quota**
   - API quotas not exceeded
   - Billing is enabled

### Slow Responses

1. Implement caching
2. Use Distance Matrix API for batch queries
3. Enable CDN for maps tiles
4. Reduce polyline precision

### Map Not Displaying

```html
<!-- Add to layout.html before closing body -->
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=geometry,places">
</script>
```

---

## 📚 Resources

- [Google Maps Platform Docs](https://developers.google.com/maps/documentation)
- [Directions API](https://developers.google.com/maps/documentation/directions/overview)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview)
- [Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Best Practices](https://developers.google.com/maps/solutions)

---

## ✅ Implementation Checklist

- [ ] Google Cloud project created
- [ ] All required APIs enabled
- [ ] API key generated with restrictions
- [ ] API key added to .env.local
- [ ] Billing enabled with budget alerts
- [ ] Real geocoding function implemented
- [ ] Real directions function implemented
- [ ] Real station finder implemented
- [ ] Map display component added
- [ ] Rate limiting configured
- [ ] Caching implemented
- [ ] Error handling added
- [ ] Tested with real coordinates
- [ ] Cost estimates reviewed
- [ ] Deployed to production

---

**Your app is now using real Google Maps!** 🗺️✨
