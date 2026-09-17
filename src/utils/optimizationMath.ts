export interface NormalizableMetric {
  label: string;
  value: number;
  min: number;
  max: number;
  weight: number;
}

export interface OptimizationScoreResult {
  score: number;
  contributions: { label: string; normalized: number; weighted: number }[];
}

export function normalizeValue(value: number, min: number, max: number): number {
  if (max <= min) return 1;
  const clamped = Math.min(max, Math.max(min, value));
  return (clamped - min) / (max - min);
}

export function optimizationScore(metrics: NormalizableMetric[]): OptimizationScoreResult {
  const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
  const safeTotal = totalWeight > 0 ? totalWeight : 1;
  const contributions = metrics.map((m) => {
    const normalized = normalizeValue(m.value, m.min, m.max);
    return { label: m.label, normalized, weighted: m.weight / safeTotal * normalized };
  });
  const score = contributions.reduce((sum, c) => sum + c.weighted, 0);
  return { score: Number((score * 100).toFixed(1)), contributions };
}

export type RoadConditionFactor = 'highway' | 'city' | 'rural';
export type WeatherConditionFactor = 'clear' | 'rain' | 'fog';
export type TrafficConditionFactor = 'free-flow' | 'moderate' | 'heavy';

const ROAD_SPEED_CAP_KMH: Record<RoadConditionFactor, number> = {
  highway: 100,
  city: 60,
  rural: 80
};

const WEATHER_SPEED_CAP_KMH: Record<WeatherConditionFactor, number> = {
  clear: Infinity,
  rain: 80,
  fog: 60
};

const TRAFFIC_SPEED_CAP_KMH: Record<TrafficConditionFactor, number> = {
  'free-flow': Infinity,
  moderate: 70,
  heavy: 45
};

export interface RecommendationContext {
  legalLimitKmh?: number;
  road?: RoadConditionFactor;
  weather?: WeatherConditionFactor;
  traffic?: TrafficConditionFactor;
}

export function recommendedSpeedKmh(
  optimalSpeedKmh: number,
  context: RecommendationContext = {}
): number {
  const caps: number[] = [];
  if (context.legalLimitKmh && context.legalLimitKmh > 0) caps.push(context.legalLimitKmh);
  if (context.road) caps.push(ROAD_SPEED_CAP_KMH[context.road]);
  if (context.weather) caps.push(WEATHER_SPEED_CAP_KMH[context.weather]);
  if (context.traffic) caps.push(TRAFFIC_SPEED_CAP_KMH[context.traffic]);
  const minCap = Math.min(...caps);
  return Math.min(optimalSpeedKmh, minCap);
}