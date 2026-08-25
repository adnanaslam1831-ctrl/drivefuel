'use client'

import React, { useState, useEffect } from 'react'
import { TripAnalysis, Vehicle } from '@/app/types'
import {
  calculateFuelRequired,
  calculateFuelCostBreakdown,
  calculateRange,
} from '@/app/services/fuelCalculations'
import {
  geocodeAddress,
  calculateRoute,
  calculateDistance,
  getCurrentLocation,
} from '@/app/services/googleMapsService'
import { MapPin, Fuel, Calendar, AlertCircle, Loader2 } from 'lucide-react'

interface TripPlannerProps {
  onAnalysisReady: (analysis: TripAnalysis, tripData: any) => void;
}

export function TripPlanner({ onAnalysisReady }: TripPlannerProps) {
  // Step state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Location
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // Step 2: Vehicle
  const [vehicleMode, setVehicleMode] = useState<'search' | 'manual'>('search');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [manualMileage, setManualMileage] = useState('14');
  const [manualTankCapacity, setManualTankCapacity] = useState('47');
  const [manualCurrentFuel, setManualCurrentFuel] = useState('30');
  const [fuelPrice, setFuelPrice] = useState('270');

  // Step 3: Time
  const [departureMode, setDepartureMode] = useState<'now' | 'later' | 'by'>('now');
  const [targetTime, setTargetTime] = useState('');

  // Demo vehicles
  const demoVehicles: Vehicle[] = [
    {
      id: '1',
      userId: '',
      name: 'Toyota Corolla 2022',
      vehicleType: 'car',
      fuelType: 'petrol',
      averageMileage: 14,
      manufacturer: 'Toyota',
      model: 'Corolla',
      year: 2022,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: '',
      name: 'Honda Civic 2021',
      vehicleType: 'car',
      fuelType: 'petrol',
      averageMileage: 15,
      manufacturer: 'Honda',
      model: 'Civic',
      year: 2021,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: '',
      name: 'Tesla Model 3',
      vehicleType: 'ev',
      fuelType: 'electric',
      averageMileage: 6, // km/kWh - 6km per kWh
      batteryCapacity: 54,
      evRange: 400,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Get current location on mount if needed
  useEffect(() => {
    if (useCurrentLocation) {
      setLoading(true);
      getCurrentLocation()
        .then((location) => {
          if (location) {
            setStartLocation(
              `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            );
          }
        })
        .catch((err) => {
          setError('Could not get your location. Please enter it manually.');
          setUseCurrentLocation(false);
        })
        .finally(() => setLoading(false));
    }
  }, [useCurrentLocation]);

  const handleAnalyze = async () => {
    if (!startLocation || !destination) {
      setError('Please enter both start location and destination');
      return;
    }

    if (!selectedVehicle && !manualMileage) {
      setError('Please select or enter vehicle information');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Geocode locations
      const startLoc = await geocodeAddress(startLocation);
      const destLoc = await geocodeAddress(destination);

      if (!startLoc || !destLoc) {
        setError('Could not find one or both locations. Please try again.');
        return;
      }

      // Calculate route
      const route = await calculateRoute(startLoc, destLoc);
      if (!route) {
        setError('Could not calculate route. Please check your locations.');
        return;
      }

      // Convert meters to km
      const distanceKm = route.distance / 1000;

      // Get vehicle data
      const mileage = selectedVehicle
        ? selectedVehicle.averageMileage
        : parseFloat(manualMileage);
      const currentFuel = selectedVehicle?.currentFuel || parseFloat(manualCurrentFuel);
      const fuelPricePerLiter = parseFloat(fuelPrice);

      // Calculate fuel
      const fuelResult = calculateFuelRequired(
        {
          distance: distanceKm,
          averageMileage: mileage,
          currentFuel,
          fuelPrice: fuelPricePerLiter,
          fuelTankCapacity: parseFloat(manualTankCapacity),
        },
        {
          trafficLevel: route.trafficDuration && route.trafficDuration > route.duration ? 'heavy' : 'normal',
        }
      );

      // Calculate cost breakdown
      const costBreakdown = calculateFuelCostBreakdown(
        distanceKm,
        fuelResult.estimatedMileage,
        fuelPricePerLiter
      );

      // Calculate arrival time
      let arrivalTime = new Date();
      arrivalTime = new Date(arrivalTime.getTime() + route.trafficDuration * 1000);

      // Create analysis
      const analysis: TripAnalysis = {
        distance: distanceKm,
        estimatedDuration: route.duration,
        trafficDelay: (route.trafficDuration || route.duration) - route.duration,
        estimatedArrival: arrivalTime,
        fuelRequired: fuelResult.fuelRequired,
        fuelCost: fuelResult.fuelCost,
        fuelRemaining: fuelResult.fuelRemaining,
        estimatedMileage: fuelResult.estimatedMileage,
        hasSufficientFuel: fuelResult.hasSufficientFuel,
        warningLevel: fuelResult.warningLevel,
        recommendedStartFuel: fuelResult.recommendedStartFuel,
        costPerKm: costBreakdown.costPerKm,
        range: calculateRange(currentFuel, fuelResult.estimatedMileage),
        safetyMargin: fuelResult.safetyMargin,
      };

      const tripData = {
        startLocation: startLoc.address || startLocation,
        destination: destLoc.address || destination,
        startLat: startLoc.lat,
        startLng: startLoc.lng,
        destLat: destLoc.lat,
        destLng: destLoc.lng,
      };

      onAnalysisReady(analysis, tripData);
    } catch (err) {
      console.error('Error analyzing trip:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-alert-50 dark:bg-alert-900/20 border border-alert-200 dark:border-alert-800 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-alert-600 dark:text-alert-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-alert-700 dark:text-alert-300">{error}</p>
        </div>
      )}

      {/* Step 1: Locations */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold">
            1
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Trip Details
          </h3>
        </div>

        <div className="space-y-3 pl-11">
          {/* Start Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Starting Location
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Enter starting location..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                />
              </div>
              <button
                type="button"
                onClick={() => setUseCurrentLocation(!useCurrentLocation)}
                className="btn btn-secondary"
                disabled={loading && useCurrentLocation}
              >
                {loading && useCurrentLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  '📍'
                )}
              </button>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Vehicle */}
      <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold">
            2
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Vehicle
          </h3>
        </div>

        <div className="space-y-3 pl-11">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setVehicleMode('search')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                vehicleMode === 'search'
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
              }`}
            >
              Select Vehicle
            </button>
            <button
              onClick={() => setVehicleMode('manual')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                vehicleMode === 'manual'
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {/* Search Mode */}
          {vehicleMode === 'search' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {demoVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      selectedVehicle?.id === vehicle.id
                        ? 'bg-brand-100 dark:bg-brand-900/30 border border-brand-500'
                        : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {vehicle.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {vehicle.averageMileage} km/L - {vehicle.fuelType}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Mode */}
          {vehicleMode === 'manual' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Average Mileage (km/L)
                </label>
                <input
                  type="number"
                  value={manualMileage}
                  onChange={(e) => setManualMileage(e.target.value)}
                  placeholder="14"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your actual fuel consumption
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tank Capacity (L)
                  </label>
                  <input
                    type="number"
                    value={manualTankCapacity}
                    onChange={(e) => setManualTankCapacity(e.target.value)}
                    placeholder="47"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Current Fuel (L)
                  </label>
                  <input
                    type="number"
                    value={manualCurrentFuel}
                    onChange={(e) => setManualCurrentFuel(e.target.value)}
                    placeholder="30"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fuel Price */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Fuel Price (PKR per Liter)
            </label>
            <div className="flex gap-2">
              <Fuel className="w-4 h-4 text-slate-400 flex-shrink-0 mt-2" />
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                placeholder="270"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Time */}
      <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold">
            3
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Timing (Optional)
          </h3>
        </div>

        <div className="space-y-3 pl-11">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDepartureMode('now')}
              className={`py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                departureMode === 'now'
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
              }`}
            >
              Leave Now
            </button>
            <button
              onClick={() => setDepartureMode('later')}
              className={`py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                departureMode === 'later'
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
              }`}
            >
              Depart Later
            </button>
            <button
              onClick={() => setDepartureMode('by')}
              className={`py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                departureMode === 'by'
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
              }`}
            >
              Arrive By
            </button>
          </div>

          {(departureMode === 'later' || departureMode === 'by') && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {departureMode === 'later' ? 'Departure Time' : 'Target Arrival Time'}
              </label>
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 mt-2" />
                <input
                  type="datetime-local"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full btn btn-primary btn-lg mt-8"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze Trip'
        )}
      </button>
    </div>
  );
}
