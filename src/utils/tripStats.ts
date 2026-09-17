import { Trip } from '../types/trip';

export const IDLE_SPEED_THRESHOLD_KMH = 5;
export const DEFAULT_HARSH_ACCEL_THRESHOLD_MPS2 = 3.0;

export interface SpeedVariationResult {
  minSpeedKmh: number;
  maxSpeedKmh: number;
  variationKmh: number;
}

export interface IdlingResult {
  idleTimeSec: number;
  totalTimeSec: number;
  idlePercent: number;
}

export interface HarshEventCount {
  accelerations: number;
  brakings: number;
}

export interface TripStats {
  samplesCount: number;
  variation: SpeedVariationResult | null;
  idling: IdlingResult | null;
  harsh: HarshEventCount | null;
  avgAccelerationMps2: number | null;
}

export function speedVariation(samples: number[]): SpeedVariationResult | null {
  if (samples.length < 2) return null;
  const minSpeedKmh = Math.min(...samples);
  const maxSpeedKmh = Math.max(...samples);
  return { minSpeedKmh, maxSpeedKmh, variationKmh: maxSpeedKmh - minSpeedKmh };
}

export function accelerationSamplesMps2(samples: number[], sampleIntervalSec = 1): number[] {
  const out: number[] = [];
  for (let i = 1; i < samples.length; i += 1) {
    const dvKmh = samples[i] - samples[i - 1];
    out.push(dvKmh / 3.6 / sampleIntervalSec);
  }
  return out;
}

export function averageAccelerationMps2(samples: number[], sampleIntervalSec = 1): number | null {
  const accels = accelerationSamplesMps2(samples, sampleIntervalSec);
  if (accels.length === 0) return null;
  return accels.reduce((sum, a) => sum + a, 0) / accels.length;
}

export function countHarshAccelerations(
  samples: number[],
  sampleIntervalSec = 1,
  thresholdMps2 = DEFAULT_HARSH_ACCEL_THRESHOLD_MPS2
): number {
  return accelerationSamplesMps2(samples, sampleIntervalSec).filter((a) => a > thresholdMps2).length;
}

export function countHarshBraking(
  samples: number[],
  sampleIntervalSec = 1,
  thresholdMps2 = DEFAULT_HARSH_ACCEL_THRESHOLD_MPS2
): number {
  return accelerationSamplesMps2(samples, sampleIntervalSec).filter((a) => -a > thresholdMps2).length;
}

export function idlingMetrics(samples: number[], idleSpeedKmh = IDLE_SPEED_THRESHOLD_KMH): IdlingResult | null {
  if (samples.length === 0) return null;
  const idleTimeSec = samples.filter((s) => s < idleSpeedKmh).length;
  return {
    idleTimeSec,
    totalTimeSec: samples.length,
    idlePercent: idleTimeSec / samples.length * 100
  };
}

export function tripStats(trip: Trip): TripStats {
  const samples = trip.speedSamples ?? [];
  return {
    samplesCount: samples.length,
    variation: speedVariation(samples),
    idling: idlingMetrics(samples),
    harsh: samples.length >= 2 ? {
      accelerations: countHarshAccelerations(samples),
      brakings: countHarshBraking(samples)
    } : null,
    avgAccelerationMps2: averageAccelerationMps2(samples)
  };
}

export function remainingFuelPercent(currentFuelL: number, tankCapacityL: number): number {
  if (!tankCapacityL || tankCapacityL <= 0) return 0;
  return Math.min(100, Math.max(0, currentFuelL / tankCapacityL * 100));
}

export function estimatedRangeKm(currentFuelL: number, mileageKmL: number): number {
  if (!mileageKmL || mileageKmL <= 0) return 0;
  return currentFuelL * mileageKmL;
}

export function plannedTripFuelL(distanceKm: number, expectedMileageKmL: number): number {
  if (!expectedMileageKmL || expectedMileageKmL <= 0) return 0;
  return distanceKm / expectedMileageKmL;
}

export function plannedTripFuelCost(distanceKm: number, expectedMileageKmL: number, pricePerL: number): number {
  return plannedTripFuelL(distanceKm, expectedMileageKmL) * pricePerL;
}

export function mileageDifference(manufacturerMileage: number, userMileage: number): {
  diff: number;
  percent: number;
} {
  const diff = manufacturerMileage - userMileage;
  const percent = manufacturerMileage > 0 ? diff / manufacturerMileage * 100 : 0;
  return { diff, percent };
}