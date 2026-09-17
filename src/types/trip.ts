export type DataQuality = 'high' | 'medium' | 'low';
export type TripSource = 'measured' | 'estimated' | 'imported';
export type GpsSource = 'gps' | 'simulated' | 'none';

export interface RoutePoint {
  lat: number;
  lng: number;
  at: number;
}

export interface GeoContext {
  country: string;
  countryCode: string;
  state?: string;
  city?: string;
  elevationM?: number;
}

export interface EnvironmentSnapshot {
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  windKmh: number;
  weatherCode: number;
  aqi: number;
  pm25: number;
  pm10: number;
  source: 'live' | 'estimated';
}

export type RoadType = 'highway' | 'city' | 'rural' | 'unknown';
export type RoadSurface = 'paved' | 'unpaved' | 'mixed' | 'unknown';

export interface RoadSnapshot {
  predominantRoadType: RoadType;
  avgMaxSpeedKmph?: number;
  roadCount: number;
  surface: RoadSurface;
}

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
  routeCoordinates?: RoutePoint[];
  geoContext?: GeoContext;
  environment?: EnvironmentSnapshot;
  environmentEnd?: EnvironmentSnapshot;
  road?: RoadSnapshot;
}