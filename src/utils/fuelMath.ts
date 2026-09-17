import { Vehicle, VehicleType, FuelType, MaintenanceCondition } from '../types/vehicle';

export interface ConsumptionModel {
  a: number;
  b: number;
  c: number;
  optimalSpeedKmh: number;
  minConsumptionL100km: number;
}

const BASE_COEFFICIENTS: Record<VehicleType, {a: number;b: number;c: number;}> = {
  car: { a: 0.003, b: -0.348, c: 16.6 },
  motorcycle: { a: 0.0022, b: -0.198, c: 5.6 },
  scooter: { a: 0.0026, b: -0.208, c: 4.2 },
  'three-wheeler': { a: 0.0028, b: -0.2856, c: 10.4 },
  other: { a: 0.0028, b: -0.308, c: 12.5 }
};

const FUEL_FACTOR: Record<FuelType, number> = {
  petrol: 1,
  diesel: 0.85,
  cng: 0.72,
  'ethanol-blend': 1.05,
  'biodiesel-blend': 0.9,
  'other-biofuel': 1
};

const CONDITION_FACTOR: Record<MaintenanceCondition, number> = {
  'well-maintained': 0.96,
  'normally-maintained': 1,
  'maintenance-required': 1.14
};

/**
 * Simplified quadratic fuel-consumption model F(v) = av^2 + bv + c.
 * Coefficients are seeded from vehicle type, fuel type, maintenance
 * condition, and age. This is intentionally a simplified model — real
 * trip data can later be used to refine it.
 */
export function getConsumptionModel(vehicle: Vehicle): ConsumptionModel {
  const base = BASE_COEFFICIENTS[vehicle.type];
  const fuelFactor = FUEL_FACTOR[vehicle.fuelType];
  const conditionFactor = CONDITION_FACTOR[vehicle.condition];
  const clampedAge = Math.min(vehicle.ageYears, 15);
  const ageFactor = 1 + clampedAge * 0.006;

  const a = base.a;
  const b = base.b + clampedAge * 0.0015; // engine drag increases slightly with age, nudging optimal speed down
  const c = base.c * fuelFactor * conditionFactor * ageFactor;

  const optimalSpeedKmh = Math.round(-b / (2 * a));
  const minConsumptionL100km = a * optimalSpeedKmh ** 2 + b * optimalSpeedKmh + c;

  return {
    a,
    b,
    c,
    optimalSpeedKmh,
    minConsumptionL100km: Number(minConsumptionL100km.toFixed(2))
  };
}

export function consumptionAtSpeed(model: ConsumptionModel, speedKmh: number): number {
  return model.a * speedKmh ** 2 + model.b * speedKmh + model.c;
}

export function buildCurvePoints(model: ConsumptionModel, minV = 10, maxV = 120, step = 5) {
  const points: {speed: number;consumption: number;}[] = [];
  for (let v = minV; v <= maxV; v += step) {
    points.push({ speed: v, consumption: Number(consumptionAtSpeed(model, v).toFixed(2)) });
  }
  return points;
}

export function computeFuelUsed(fuelBeforeL: number, fuelAfterL: number, fuelRefilledL = 0): number {
  return Math.max(0, fuelBeforeL + fuelRefilledL - fuelAfterL);
}

export function computeMileage(distanceKm: number, fuelUsedL: number): number | null {
  if (!fuelUsedL || fuelUsedL <= 0) return null;
  return distanceKm / fuelUsedL;
}

export function computeConsumption100(fuelUsedL: number, distanceKm: number): number | null {
  if (!distanceKm || distanceKm <= 0) return null;
  return fuelUsedL / distanceKm * 100;
}

export function computeFuelCost(fuelUsedL: number, pricePerL: number): number {
  return fuelUsedL * pricePerL;
}

export function computeCostPerKm(fuelCost: number, distanceKm: number): number | null {
  if (!distanceKm || distanceKm <= 0) return null;
  return fuelCost / distanceKm;
}

const CO2_FACTOR_KG_PER_L: Record<FuelType, number> = {
  petrol: 2.31,
  diesel: 2.68,
  cng: 1.9,
  'ethanol-blend': 1.9,
  'biodiesel-blend': 2.2,
  'other-biofuel': 2.0
};

export function estimateCO2Kg(fuelUsedL: number, fuelType: FuelType): number {
  return Number((fuelUsedL * CO2_FACTOR_KG_PER_L[fuelType]).toFixed(1));
}

export function estimateCO2SavedKg(
distanceKm: number,
actualFuelUsedL: number,
manufacturerMileage: number,
fuelType: FuelType)
: number {
  if (!manufacturerMileage || manufacturerMileage <= 0) return 0;
  const baselineFuelUsed = distanceKm / manufacturerMileage;
  const diff = baselineFuelUsed - actualFuelUsedL;
  return Number(Math.max(0, diff * CO2_FACTOR_KG_PER_L[fuelType]).toFixed(1));
}

export interface DataQualityResult {
  quality: 'high' | 'medium' | 'low';
  reasons: string[];
}

export function assessDataQuality(params: {
  durationSec: number;
  hasFuelData: boolean;
  fuelEstimated: boolean;
  gpsAccuracyLow?: boolean;
  maintenanceDataComplete: boolean;
}): DataQualityResult {
  const reasons: string[] = [];
  let score = 100;

  if (params.durationSec < 180) {
    reasons.push('Short trip duration');
    score -= 25;
  }
  if (!params.hasFuelData) {
    reasons.push('Missing fuel information');
    score -= 35;
  } else if (params.fuelEstimated) {
    reasons.push('Estimated fuel level');
    score -= 15;
  }
  if (params.gpsAccuracyLow) {
    reasons.push('Lower GPS accuracy');
    score -= 15;
  }
  if (!params.maintenanceDataComplete) {
    reasons.push('Incomplete maintenance data');
    score -= 10;
  }

  const quality: DataQualityResult['quality'] = score >= 80 ? 'high' : score >= 55 ? 'medium' : 'low';
  return { quality, reasons };
}