import { FuelType } from '../types/vehicle';
import { CO2_FACTOR_KG_PER_L } from './fuelMath';
import { FUEL_ENERGY_DENSITY_MJ_PER_L } from './physicsMath';

export function operatingCostPerTrip(fuelCost: number, maintenanceExpense: number): number {
  return fuelCost + maintenanceExpense;
}

export function maintenanceCostPerKm(maintenanceExpense: number, distanceKm: number): number | null {
  if (!distanceKm || distanceKm <= 0) return null;
  return maintenanceExpense / distanceKm;
}

export function maintenanceImpactKmL(manufacturerMileage: number, observedMileage: number): number {
  return manufacturerMileage - observedMileage;
}

export function estimatedEmissionsKg(fuelUsedL: number, fuelType: FuelType): number {
  return Number((fuelUsedL * CO2_FACTOR_KG_PER_L[fuelType]).toFixed(1));
}

export function tripEnergyMJ(fuelUsedL: number, fuelType: FuelType): number {
  return Number((fuelUsedL * FUEL_ENERGY_DENSITY_MJ_PER_L[fuelType]).toFixed(1));
}