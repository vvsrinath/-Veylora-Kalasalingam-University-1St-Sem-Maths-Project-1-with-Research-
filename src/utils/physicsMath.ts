import { Vehicle, VehicleType, FuelType } from '../types/vehicle';

export const GRAVITY_MPS2 = 9.81;
export const DEFAULT_AIR_DENSITY_KG_M3 = 1.225;

export const FUEL_ENERGY_DENSITY_MJ_PER_L: Record<FuelType, number> = {
  petrol: 34.2,
  diesel: 38.3,
  cng: 22.0,
  'ethanol-blend': 25.3,
  'biodiesel-blend': 33.3,
  'other-biofuel': 30.0
};

interface AeroDefaults {
  dragCoefficient: number;
  frontalAreaM2: number;
  rollingCoefficient: number;
}

const AERO_DEFAULTS: Record<VehicleType, AeroDefaults> = {
  car: { dragCoefficient: 0.32, frontalAreaM2: 2.2, rollingCoefficient: 0.012 },
  motorcycle: { dragCoefficient: 0.9, frontalAreaM2: 0.7, rollingCoefficient: 0.015 },
  scooter: { dragCoefficient: 0.9, frontalAreaM2: 0.6, rollingCoefficient: 0.016 },
  'three-wheeler': { dragCoefficient: 0.55, frontalAreaM2: 1.2, rollingCoefficient: 0.014 },
  other: { dragCoefficient: 0.4, frontalAreaM2: 2.0, rollingCoefficient: 0.013 }
};

const WEIGHT_DEFAULTS_KG: Record<VehicleType, number> = {
  car: 1300,
  motorcycle: 180,
  scooter: 100,
  'three-wheeler': 400,
  other: 800
};

export interface PhysicsSpec {
  massKg: number;
  dragCoefficient: number;
  frontalAreaM2: number;
  rollingCoefficient: number;
}

export function physicsSpec(vehicle: Vehicle): PhysicsSpec {
  const defaults = AERO_DEFAULTS[vehicle.type];
  return {
    massKg: vehicle.weightKg ?? WEIGHT_DEFAULTS_KG[vehicle.type],
    dragCoefficient: defaults.dragCoefficient,
    frontalAreaM2: defaults.frontalAreaM2,
    rollingCoefficient: defaults.rollingCoefficient
  };
}

export function kmhToMs(speedKmh: number): number {
  return speedKmh / 3.6;
}

export function msToKmh(speedMs: number): number {
  return speedMs * 3.6;
}

export function elevationChangeM(startElevationM: number, endElevationM: number): number {
  return endElevationM - startElevationM;
}

export function gradientPercent(elevationChangeM: number, horizontalDistanceM: number): number {
  if (!horizontalDistanceM || horizontalDistanceM <= 0) return 0;
  return elevationChangeM / horizontalDistanceM * 100;
}

export function climbAngleRad(gradePercent: number): number {
  return Math.atan(gradePercent / 100);
}

export function slopeForceN(massKg: number, gradePercent: number): number {
  return massKg * GRAVITY_MPS2 * Math.sin(climbAngleRad(gradePercent));
}

export function rollingResistanceForceN(
  massKg: number,
  gradePercent: number,
  rollingCoefficient = 0.012
): number {
  return rollingCoefficient * massKg * GRAVITY_MPS2 * Math.cos(climbAngleRad(gradePercent));
}

export function aerodynamicDragN(
  speedKmh: number,
  dragCoefficient: number,
  frontalAreaM2: number,
  airDensityKgM3 = DEFAULT_AIR_DENSITY_KG_M3
): number {
  const v = kmhToMs(speedKmh);
  return 0.5 * airDensityKgM3 * dragCoefficient * frontalAreaM2 * v * v;
}

export function roadLoadForceN(spec: PhysicsSpec, speedKmh: number, gradePercent = 0): number {
  return (
    rollingResistanceForceN(spec.massKg, gradePercent, spec.rollingCoefficient) +
    slopeForceN(spec.massKg, gradePercent) +
    aerodynamicDragN(speedKmh, spec.dragCoefficient, spec.frontalAreaM2)
  );
}

export function powerRequiredW(forceN: number, speedKmh: number): number {
  return forceN * kmhToMs(speedKmh);
}

export function fuelEnergyMJ(fuelLitres: number, energyDensityMJPerL: number): number {
  return fuelLitres * energyDensityMJPerL;
}