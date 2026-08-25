/**
 * Fuel Calculation Engine
 * Handles all fuel consumption calculations for DriveFuel
 */

export interface FuelCalculationInput {
  distance: number; // km
  averageMileage: number; // km/L
  currentFuel: number; // liters
  fuelPrice: number; // per liter
  fuelTankCapacity?: number; // liters
}

export interface TrafficAdjustment {
  cityDrivingPercent: number; // 0-100
  trafficLevel: 'light' | 'normal' | 'heavy'; // affects consumption
  averageSpeed?: number; // km/h
  acceleration?: 'smooth' | 'moderate' | 'aggressive';
  airConditioning?: boolean;
  vehicleLoad?: 'light' | 'normal' | 'heavy';
  weather?: 'clear' | 'rain' | 'snow';
}

export interface FuelCalculationResult {
  fuelRequired: number;
  fuelCost: number;
  fuelRemaining: number;
  estimatedMileage: number;
  hasSufficientFuel: boolean;
  safetyMargin: number; // percentage
  recommendedStartFuel: number; // with buffer
  warningLevel: 'safe' | 'caution' | 'warning' | 'critical';
}

/**
 * Calculate base fuel requirement
 * Formula: Distance / AverageMileage = FuelRequired
 */
export function calculateBaseFuelRequirement(
  distance: number,
  averageMileage: number
): number {
  return distance / averageMileage;
}

/**
 * Adjust fuel consumption based on real-world factors
 */
export function adjustFuelConsumption(
  baseFuel: number,
  adjustments: Partial<TrafficAdjustment>
): { adjustedMileage: number; adjustedFuel: number } {
  let mileageMultiplier = 1;

  // Traffic adjustment
  if (adjustments.trafficLevel) {
    switch (adjustments.trafficLevel) {
      case 'light':
        mileageMultiplier *= 1.05; // Better efficiency
        break;
      case 'normal':
        mileageMultiplier *= 1;
        break;
      case 'heavy':
        mileageMultiplier *= 0.85; // 15% worse efficiency
        break;
    }
  }

  // City driving adjustment
  if (adjustments.cityDrivingPercent) {
    const cityPercent = adjustments.cityDrivingPercent / 100;
    const cityMultiplier = 0.8; // City driving is 20% less efficient
    mileageMultiplier *= 1 - cityPercent * (1 - cityMultiplier);
  }

  // Acceleration style
  if (adjustments.acceleration) {
    switch (adjustments.acceleration) {
      case 'smooth':
        mileageMultiplier *= 1.1;
        break;
      case 'moderate':
        mileageMultiplier *= 1;
        break;
      case 'aggressive':
        mileageMultiplier *= 0.9;
        break;
    }
  }

  // Air conditioning
  if (adjustments.airConditioning) {
    mileageMultiplier *= 0.95; // 5% worse with AC
  }

  // Vehicle load
  if (adjustments.vehicleLoad) {
    switch (adjustments.vehicleLoad) {
      case 'light':
        mileageMultiplier *= 1.05;
        break;
      case 'normal':
        mileageMultiplier *= 1;
        break;
      case 'heavy':
        mileageMultiplier *= 0.9;
        break;
    }
  }

  // Weather
  if (adjustments.weather) {
    switch (adjustments.weather) {
      case 'clear':
        mileageMultiplier *= 1;
        break;
      case 'rain':
        mileageMultiplier *= 0.95;
        break;
      case 'snow':
        mileageMultiplier *= 0.85;
        break;
    }
  }

  const adjustedMileage = mileageMultiplier;
  const adjustedFuel = baseFuel * (1 / mileageMultiplier);

  return { adjustedMileage, adjustedFuel };
}

/**
 * Complete fuel calculation with all factors
 */
export function calculateFuelRequired(
  input: FuelCalculationInput,
  adjustments?: Partial<TrafficAdjustment>,
  safetyBuffer: number = 15 // percentage
): FuelCalculationResult {
  // Calculate base requirement
  const baseFuel = calculateBaseFuelRequirement(input.distance, input.averageMileage);

  // Apply adjustments
  let estimatedMileage = input.averageMileage;
  let fuelRequired = baseFuel;

  if (adjustments) {
    const { adjustedMileage, adjustedFuel } = adjustFuelConsumption(baseFuel, adjustments);
    estimatedMileage = input.averageMileage * adjustedMileage;
    fuelRequired = adjustedFuel;
  }

  // Calculate remaining fuel
  const fuelRemaining = input.currentFuel - fuelRequired;

  // Check safety
  const hasSufficientFuel = fuelRemaining >= 0;

  // Calculate safety margin
  const safetyMarginLiters = input.fuelTankCapacity
    ? input.fuelTankCapacity * (safetyBuffer / 100)
    : fuelRequired * (safetyBuffer / 100);

  const recommendedStartFuel = fuelRequired + safetyMarginLiters;

  // Determine warning level
  let warningLevel: 'safe' | 'caution' | 'warning' | 'critical' = 'safe';

  if (!hasSufficientFuel) {
    warningLevel = 'critical';
  } else if (fuelRemaining < safetyMarginLiters) {
    warningLevel = 'warning';
  } else if (fuelRemaining < safetyMarginLiters * 1.5) {
    warningLevel = 'caution';
  }

  return {
    fuelRequired: Math.ceil(fuelRequired * 100) / 100, // Round up to 2 decimals
    fuelCost: Math.round(fuelRequired * input.fuelPrice * 100) / 100,
    fuelRemaining: Math.max(0, Math.floor(fuelRemaining * 100) / 100),
    estimatedMileage: Math.round(estimatedMileage * 100) / 100,
    hasSufficientFuel,
    safetyMargin: Math.round(safetyMarginLiters * 100) / 100,
    recommendedStartFuel: Math.ceil(recommendedStartFuel * 100) / 100,
    warningLevel,
  };
}

/**
 * Calculate fuel range based on current fuel and mileage
 */
export function calculateRange(
  currentFuel: number,
  estimatedMileage: number
): number {
  return Math.floor(currentFuel * estimatedMileage);
}

/**
 * Check if current fuel is sufficient for trip
 */
export function checkFuelSufficiency(
  remainingFuel: number,
  fuelRequired: number,
  safetyBuffer: number = 15
): {
  isSufficient: boolean;
  shortfall?: number;
  recommendedRefuelAmount?: number;
} {
  const requiredWithBuffer = fuelRequired * (1 + safetyBuffer / 100);

  if (remainingFuel >= requiredWithBuffer) {
    return { isSufficient: true };
  }

  const shortfall = Math.ceil((requiredWithBuffer - remainingFuel) * 100) / 100;
  const recommendedRefuelAmount = Math.ceil(shortfall * 100) / 100;

  return {
    isSufficient: false,
    shortfall,
    recommendedRefuelAmount,
  };
}

/**
 * Calculate fuel price breakdown
 */
export function calculateFuelCostBreakdown(
  distance: number,
  estimatedMileage: number,
  fuelPrice: number,
  currencySymbol: string = 'PKR'
): {
  totalCost: number;
  costPerKm: number;
  costPerLiter: number;
  formatted: string;
} {
  const fuelRequired = distance / estimatedMileage;
  const totalCost = fuelRequired * fuelPrice;
  const costPerKm = totalCost / distance;

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    costPerKm: Math.round(costPerKm * 100) / 100,
    costPerLiter: fuelPrice,
    formatted: `${currencySymbol} ${Math.round(totalCost).toLocaleString()}`,
  };
}

/**
 * Estimate real-world mileage adjustment factor
 */
export function getRealisticMileageAdjustment(
  officialMileage: number,
  trafficLevel: 'light' | 'normal' | 'heavy' = 'normal',
  drivingStyle: 'efficient' | 'normal' | 'aggressive' = 'normal'
): number {
  let multiplier = 1;

  // Official specs tend to be optimistic - reduce by 10-15%
  multiplier *= 0.87;

  // Traffic adjustment
  switch (trafficLevel) {
    case 'light':
      multiplier *= 1.05;
      break;
    case 'heavy':
      multiplier *= 0.85;
      break;
  }

  // Driving style
  switch (drivingStyle) {
    case 'efficient':
      multiplier *= 1.15;
      break;
    case 'aggressive':
      multiplier *= 0.9;
      break;
  }

  return officialMileage * multiplier;
}

/**
 * EV range and charging calculation
 */
export function calculateEVRange(
  batteryCapacity: number, // kWh
  energyConsumption: number, // kWh per 100km
  currentBatteryPercent: number // 0-100
): number {
  const usableEnergy = batteryCapacity * (currentBatteryPercent / 100);
  const range = (usableEnergy / energyConsumption) * 100;
  return Math.floor(range);
}

/**
 * EV charging cost calculation
 */
export function calculateEVChargingCost(
  energyNeeded: number, // kWh
  chargingCostPerKwh: number
): number {
  return Math.round(energyNeeded * chargingCostPerKwh * 100) / 100;
}
