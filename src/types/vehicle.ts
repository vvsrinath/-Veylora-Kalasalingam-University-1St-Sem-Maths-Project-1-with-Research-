export type VehicleType = 'car' | 'motorcycle' | 'scooter' | 'three-wheeler' | 'other';

export type FuelType =
'petrol' |
'diesel' |
'cng' |
'ethanol-blend' |
'biodiesel-blend' |
'other-biofuel';

export type MaintenanceCondition = 'well-maintained' | 'normally-maintained' | 'maintenance-required';

export type PartCondition = 'good' | 'fair' | 'poor';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  fuelType: FuelType;
  tankCapacityL: number;
  manufacturerMileage: number;
  userObservedMileage?: number;
  ageYears: number;
  odometerKm: number;
  weightKg?: number;
  condition: MaintenanceCondition;
  lastServiceDate?: string;
  tyrePressureCondition?: PartCondition;
  engineCondition?: PartCondition;
  knownIssues?: string;
}

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Car',
  motorcycle: 'Motorcycle',
  scooter: 'Scooter',
  'three-wheeler': 'Three-wheeler',
  other: 'Other'
};

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  cng: 'CNG',
  'ethanol-blend': 'Ethanol blend',
  'biodiesel-blend': 'Biodiesel blend',
  'other-biofuel': 'Other biofuel'
};

export const CONDITION_LABELS: Record<MaintenanceCondition, string> = {
  'well-maintained': 'Well maintained',
  'normally-maintained': 'Normally maintained',
  'maintenance-required': 'Maintenance required'
};