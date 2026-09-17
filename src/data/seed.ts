import { Vehicle } from '../types/vehicle';
import { Trip } from '../types/trip';
import {
  computeFuelUsed,
  computeMileage,
  computeConsumption100,
  computeFuelCost,
  computeCostPerKm,
  assessDataQuality } from
'../utils/fuelMath';

export const seedVehicle: Vehicle = {
  id: 'veh-honda-city',
  name: 'Honda City',
  type: 'car',
  fuelType: 'petrol',
  tankCapacityL: 40,
  manufacturerMileage: 18,
  userObservedMileage: 17.2,
  ageYears: 3,
  odometerKm: 32450,
  weightKg: 1150,
  condition: 'normally-maintained',
  lastServiceDate: '2026-06-12',
  tyrePressureCondition: 'good',
  engineCondition: 'good'
};

interface SeedTripInput {
  id: string;
  daysAgo: number;
  distanceKm: number;
  durationSec: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  fuelBeforeL: number;
  fuelAfterL: number;
  pricePerL: number;
  co2SavedKg: number;
}

function buildTrip(input: SeedTripInput): Trip {
  const date = new Date();
  date.setDate(date.getDate() - input.daysAgo);

  const fuelUsedL = computeFuelUsed(input.fuelBeforeL, input.fuelAfterL);
  const mileageKmL = computeMileage(input.distanceKm, fuelUsedL) ?? undefined;
  const consumptionL100km = computeConsumption100(fuelUsedL, input.distanceKm) ?? undefined;
  const fuelCost = computeFuelCost(fuelUsedL, input.pricePerL);
  const costPerKm = computeCostPerKm(fuelCost, input.distanceKm) ?? undefined;
  const quality = assessDataQuality({
    durationSec: input.durationSec,
    hasFuelData: true,
    fuelEstimated: false,
    maintenanceDataComplete: true
  });

  return {
    id: input.id,
    vehicleId: seedVehicle.id,
    date: date.toISOString(),
    distanceKm: input.distanceKm,
    durationSec: input.durationSec,
    avgSpeedKmh: input.avgSpeedKmh,
    maxSpeedKmh: input.maxSpeedKmh,
    speedSamples: [],
    fuelBeforeL: input.fuelBeforeL,
    fuelAfterL: input.fuelAfterL,
    fuelUsedL,
    mileageKmL,
    consumptionL100km,
    fuelCost,
    costPerKm,
    co2SavedKg: input.co2SavedKg,
    dataQuality: quality.quality,
    dataQualityReasons: quality.reasons,
    source: 'measured',
    gpsSource: 'gps'
  };
}

export const seedTrips: Trip[] = [
buildTrip({
  id: 'trip-1',
  daysAgo: 1,
  distanceKm: 42.6,
  durationSec: 3180,
  avgSpeedKmh: 48,
  maxSpeedKmh: 82,
  fuelBeforeL: 28,
  fuelAfterL: 25.2,
  pricePerL: 101.8,
  co2SavedKg: 1.6
}),
buildTrip({
  id: 'trip-2',
  daysAgo: 3,
  distanceKm: 18.2,
  durationSec: 1620,
  avgSpeedKmh: 40,
  maxSpeedKmh: 64,
  fuelBeforeL: 25.2,
  fuelAfterL: 24,
  pricePerL: 101.8,
  co2SavedKg: 0.5
}),
buildTrip({
  id: 'trip-3',
  daysAgo: 6,
  distanceKm: 96.5,
  durationSec: 5760,
  avgSpeedKmh: 58,
  maxSpeedKmh: 104,
  fuelBeforeL: 38,
  fuelAfterL: 32.4,
  pricePerL: 101.5,
  co2SavedKg: 3.1
}),
buildTrip({
  id: 'trip-4',
  daysAgo: 10,
  distanceKm: 24.8,
  durationSec: 2280,
  avgSpeedKmh: 39,
  maxSpeedKmh: 58,
  fuelBeforeL: 24,
  fuelAfterL: 22.4,
  pricePerL: 101.5,
  co2SavedKg: 0.4
})];