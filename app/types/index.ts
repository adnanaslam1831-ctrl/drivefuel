/**
 * DriveFuel Type Definitions
 */

// Vehicle Types
export type VehicleType = 'car' | 'motorcycle' | 'suv' | 'pickup' | 'van' | 'truck' | 'bus' | 'ev' | 'hybrid' | 'other';
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'lpg' | 'electric' | 'hybrid';
export type TransmissionType = 'manual' | 'automatic' | 'cvt';

export interface Vehicle {
  id: string;
  userId: string;
  name: string;
  vehicleType: VehicleType;
  manufacturer?: string;
  model?: string;
  year?: number;
  fuelType: FuelType;
  tankCapacity?: number;
  currentFuel?: number;
  averageMileage: number;
  fuelPrice?: number;
  batteryCapacity?: number;
  evRange?: number;
  chargingCost?: number;
  engineSize?: string;
  horsepower?: number;
  torque?: number;
  transmission?: TransmissionType;
  createdAt: Date;
  updatedAt: Date;
}

// Trip Types
export interface Trip {
  id: string;
  userId: string;
  vehicleId: string;
  startLocation: string;
  startLat: number;
  startLng: number;
  destination: string;
  destLat: number;
  destLng: number;
  distance: number;
  duration: number;
  trafficDelay: number;
  fuelRequired: number;
  fuelCost: number;
  fuelRemaining: number;
  estimatedMileage: number;
  departureTime?: Date;
  arrivalTime?: Date;
  targetArrival?: Date;
  routePolyline?: string;
  stops: TripStop[];
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  actualDistance?: number;
  actualFuel?: number;
  actualTime?: number;
  efficiencyScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripStop {
  id: string;
  tripId: string;
  order: number;
  location: string;
  lat: number;
  lng: number;
  locationType: 'fuel_station' | 'ev_charging' | 'restaurant' | 'rest' | 'custom';
  eta?: Date;
  distanceFromStart?: number;
}

// Trip Analysis Result
export interface TripAnalysis {
  distance: number;
  estimatedDuration: number;
  trafficDelay: number;
  estimatedArrival: Date;
  fuelRequired: number;
  fuelCost: number;
  fuelRemaining: number;
  estimatedMileage: number;
  hasSufficientFuel: boolean;
  warningLevel: 'safe' | 'caution' | 'warning' | 'critical';
  recommendedStartFuel: number;
  costPerKm: number;
  range: number;
  safetyMargin: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  currency: string;
  temperatureUnit: 'C' | 'F';
  speedUnit: 'km/h' | 'mph';
  distanceUnit: 'km' | 'miles';
  darkMode: boolean;
  safetyBuffer: number;
}

// Subscription Types
export type PlanType = 'free' | 'pro' | 'business';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: 'active' | 'canceled' | 'expired';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelledAt?: Date;
}

// Location Types
export interface Location {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeType: 'home' | 'work' | 'favorite' | 'frequent';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Demo Data Types
export interface DemoTrip {
  id: string;
  startLocation: string;
  destination: string;
  distance: number;
  duration: number;
  vehicle: {
    name: string;
    mileage: number;
  };
  analysis: TripAnalysis;
}
