import { Trip } from '../types/trip';
import { Vehicle } from '../types/vehicle';

/**
 * Produces practical, non-judgmental recommendations from a trip's own
 * data. Never makes safety, legal, or medical claims, and never
 * encourages unsafe low- or high-speed driving.
 */
export function generateRecommendations(trip: Trip, vehicle: Vehicle, optimalSpeedKmh: number): string[] {
  const recs: string[] = [];

  if (trip.maxSpeedKmh - trip.avgSpeedKmh > 35) {
    recs.push('Your recorded speed varied considerably during this trip. A smoother speed pattern may reduce estimated consumption.');
  }

  if (Math.abs(trip.avgSpeedKmh - optimalSpeedKmh) > 15) {
    recs.push(`Your average speed was noticeably different from the estimated optimal speed of ${optimalSpeedKmh} km/h for this vehicle.`);
  }

  if (!vehicle.tyrePressureCondition) {
    recs.push('Your tyre-pressure information is missing. Adding it can improve the accuracy of future estimates.');
  }

  if (trip.source === 'estimated') {
    recs.push('This result is less reliable because fuel used was estimated rather than measured.');
  }

  if (vehicle.condition === 'maintenance-required') {
    recs.push('Your vehicle\u2019s maintenance condition suggests a service may help restore fuel efficiency.');
  } else if (!vehicle.lastServiceDate) {
    recs.push('Your vehicle\u2019s maintenance information has not been updated recently.');
  }

  if (trip.durationSec > 0 && trip.durationSec < 180) {
    recs.push('This was a short trip \u2014 estimates are generally more reliable over longer distances.');
  }

  if (recs.length === 0) {
    recs.push('Your driving pattern for this trip looks consistent with efficient fuel use. Keep it up.');
  }

  return recs.slice(0, 4);
}