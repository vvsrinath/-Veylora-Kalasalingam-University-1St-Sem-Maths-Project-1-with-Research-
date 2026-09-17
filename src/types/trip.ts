export type DataQuality = 'high' | 'medium' | 'low';
export type TripSource = 'measured' | 'estimated' | 'imported';
export type GpsSource = 'gps' | 'simulated' | 'none';

export interface Trip {
  id: string;
  vehicleId: string;
  date: string;
  distanceKm: number;
  durationSec: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  speedSamples: number[];
  fuelBeforeL?: number;
  fuelAfterL?: number;
  fuelRefilledL?: number;
  fuelPricePerL?: number;
  fuelUsedL?: number;
  mileageKmL?: number;
  consumptionL100km?: number;
  fuelCost?: number;
  costPerKm?: number;
  co2SavedKg?: number;
  dataQuality: DataQuality;
  dataQualityReasons: string[];
  source: TripSource;
  gpsSource?: GpsSource;
  avgAccuracyM?: number;
  optimalSpeedAtTripKmh?: number;
  recommendations?: string[];
}