/**
 * Google Maps Integration Service
 * Handles all Google Maps API calls
 */

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
}

export interface RouteInfo {
  distance: number; // meters
  duration: number; // seconds
  trafficDuration?: number; // with traffic, in seconds
  polyline?: string;
  steps?: RouteStep[];
}

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  location: Location;
}

export interface NearbyPlace {
  name: string;
  location: Location;
  address: string;
  placeId: string;
  rating?: number;
  distance: number; // meters from origin
  openNow?: boolean;
}

/**
 * Geocode an address to coordinates
 * Note: This would normally call the Google Geocoding API
 * For now, returns mock data for demo
 */
export async function geocodeAddress(address: string): Promise<Location | null> {
  try {
    // Mock implementation - in production, call Google Geocoding API
    const mockGeocodes: Record<string, Location> = {
      'Islamabad': {
        lat: 33.7294,
        lng: 73.1883,
        address: 'Islamabad, Pakistan',
      },
      'Lahore': {
        lat: 31.5204,
        lng: 74.3587,
        address: 'Lahore, Pakistan',
      },
      'Karachi': {
        lat: 24.8607,
        lng: 67.0011,
        address: 'Karachi, Pakistan',
      },
      'Islamabad International Airport': {
        lat: 33.5516,
        lng: 73.1176,
        address: 'Islamabad International Airport, Pakistan',
      },
      'Lahore International Airport': {
        lat: 31.5215,
        lng: 74.0255,
        address: 'Lahore International Airport, Pakistan',
      },
    }

    const key = Object.keys(mockGeocodes).find((k) =>
      address.toLowerCase().includes(k.toLowerCase())
    )

    if (key) {
      return mockGeocodes[key]
    }

    // Fallback for other locations
    return {
      lat: 33.7294 + Math.random() * 5,
      lng: 73.1883 + Math.random() * 5,
      address,
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Get current user location via Geolocation API
 */
export async function getCurrentLocation(): Promise<Location | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        reject(error)
      }
    )
  })
}

/**
 * Calculate route between two locations
 */
export async function calculateRoute(
  start: Location,
  end: Location,
  options?: {
    mode?: 'driving' | 'transit' | 'walking' | 'bicycling';
    alternatives?: boolean;
    avoidTolls?: boolean;
    avoidHighways?: boolean;
  }
): Promise<RouteInfo | null> {
  try {
    // Mock implementation - in production, call Google Directions API
    const distance = calculateHaversineDistance(start, end);
    const duration = Math.round((distance / 80) * 3600); // Assume average 80 km/h

    // Add some traffic delay estimate
    const trafficMultiplier = 1.2; // 20% traffic overhead
    const trafficDuration = Math.round(duration * trafficMultiplier);

    return {
      distance: distance * 1000, // Convert to meters
      duration,
      trafficDuration,
      polyline: '', // In production, get from API
    };
  } catch (error) {
    console.error('Route calculation error:', error);
    return null;
  }
}

/**
 * Find nearby fuel stations
 */
export async function findNearbyFuelStations(
  location: Location,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  try {
    // Mock implementation - in production, call Google Places API
    const mockStations: NearbyPlace[] = [
      {
        name: 'Shell Petrol Station',
        location: {
          lat: location.lat + 0.01,
          lng: location.lng + 0.01,
        },
        address: 'Main Road, Islamabad',
        placeId: 'ChIJ123',
        rating: 4.5,
        distance: 1200,
        openNow: true,
      },
      {
        name: 'PSO Fuel Station',
        location: {
          lat: location.lat - 0.005,
          lng: location.lng + 0.015,
        },
        address: 'Express Way, Islamabad',
        placeId: 'ChIJ456',
        rating: 4.2,
        distance: 2100,
        openNow: true,
      },
      {
        name: 'Total Energies',
        location: {
          lat: location.lat + 0.02,
          lng: location.lng - 0.01,
        },
        address: 'Airport Road, Islamabad',
        placeId: 'ChIJ789',
        rating: 4.7,
        distance: 3500,
        openNow: true,
      },
    ];

    return mockStations;
  } catch (error) {
    console.error('Fuel station search error:', error);
    return [];
  }
}

/**
 * Find nearby EV charging stations
 */
export async function findNearbyChargingStations(
  location: Location,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  try {
    // Mock implementation
    const mockStations: NearbyPlace[] = [
      {
        name: 'Fast Charging Hub - Downtown',
        location: {
          lat: location.lat + 0.008,
          lng: location.lng + 0.008,
        },
        address: 'Main Street, Islamabad',
        placeId: 'ChIJev1',
        distance: 900,
        openNow: true,
      },
      {
        name: 'Hotel Parking Charger',
        location: {
          lat: location.lat - 0.012,
          lng: location.lng + 0.01,
        },
        address: 'Luxury Hotel, Islamabad',
        placeId: 'ChIJev2',
        distance: 1800,
        openNow: true,
      },
    ];

    return mockStations;
  } catch (error) {
    console.error('Charging station search error:', error);
    return [];
  }
}

/**
 * Haversine formula to calculate distance between two coordinates
 */
function calculateHaversineDistance(
  start: Location,
  end: Location
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((end.lat - start.lat) * Math.PI) / 180;
  const dLng = ((end.lng - start.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((start.lat * Math.PI) / 180) *
      Math.cos((end.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate distance between two coordinates in meters
 */
export function calculateDistance(start: Location, end: Location): number {
  return Math.round(calculateHaversineDistance(start, end) * 1000);
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
