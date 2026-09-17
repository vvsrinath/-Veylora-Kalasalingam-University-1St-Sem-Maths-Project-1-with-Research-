import { EnvironmentSnapshot, GeoContext, RoadSnapshot, RoutePoint, RoadType, RoadSurface } from '../types/trip';

const OPEN_METEO_WEATHER = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const OPEN_METEO_ELEVATION = 'https://api.open-meteo.com/v1/elevation';
const BIGDATACLOUD_GEOCODE = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

interface OpenMeteoWeatherResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
}

interface OpenMeteoAirResponse {
  current?: {
    us_aqi?: number;
    pm2_5?: number;
    pm10?: number;
  };
}

interface ElevationResponse {
  elevation?: number[];
}

interface ReverseGeocodeResponse {
  countryCode?: string;
  countryName?: string;
  principalSubdivision?: string;
  city?: string;
  locality?: string;
}

interface OverpassElement {
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

async function fetchJson<T>(url: string, timeoutMs = 6000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } finally {
    window.clearTimeout(timer);
  }
}

function rounded(value: number | undefined, fallback: number, decimals = 1): number {
  if (value == null || Number.isNaN(value)) return fallback;
  return Number(value.toFixed(decimals));
}

export async function fetchEnvironment(lat: number, lng: number): Promise<EnvironmentSnapshot | null> {
  try {
    const q = `latitude=${lat}&longitude=${lng}`;
    const [weather, air] = await Promise.all([
      fetchJson<OpenMeteoWeatherResponse>(`${OPEN_METEO_WEATHER}?${q}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`),
      fetchJson<OpenMeteoAirResponse>(`${OPEN_METEO_AIR}?${q}&current=us_aqi,pm2_5,pm10`)
    ]);
    const w = weather.current;
    const a = air.current;
    if (!w) return null;
    return {
      temperatureC: rounded(w.temperature_2m, 25),
      feelsLikeC: rounded(w.apparent_temperature, w.temperature_2m ?? 25),
      humidity: rounded(w.relative_humidity_2m, 50, 0),
      windKmh: rounded(w.wind_speed_10m, 0, 0),
      weatherCode: w.weather_code ?? 0,
      aqi: rounded(a?.us_aqi, 0, 0),
      pm25: rounded(a?.pm2_5, 0, 1),
      pm10: rounded(a?.pm10, 0, 1),
      source: 'live'
    };
  } catch {
    return null;
  }
}

export async function fetchElevation(lat: number, lng: number): Promise<number | null> {
  try {
    const res = await fetchJson<ElevationResponse>(
      `${OPEN_METEO_ELEVATION}?latitude=${lat}&longitude=${lng}&model=gmted2020`,
      5000
    );
    const meters = res.elevation?.[0];
    return typeof meters === 'number' ? Math.round(meters) : null;
  } catch {
    return null;
  }
}

export async function fetchGeoContext(lat: number, lng: number): Promise<GeoContext | null> {
  try {
    const geo = await fetchJson<ReverseGeocodeResponse>(
      `${BIGDATACLOUD_GEOCODE}?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!geo || !geo.countryCode) return null;
    const context: GeoContext = {
      country: geo.countryName ?? 'Unknown',
      countryCode: geo.countryCode,
      state: geo.principalSubdivision ?? undefined,
      city: geo.city ?? geo.locality ?? undefined
    };
    const elevation = await fetchElevation(lat, lng);
    if (elevation != null) context.elevationM = elevation;
    return context;
  } catch {
    return null;
  }
}

export function routeBoundingBox(points: RoutePoint[]): { south: number; west: number; north: number; east: number; } | null {
  if (points.length === 0) return null;
  let south = Infinity;
  let west = Infinity;
  let north = -Infinity;
  let east = -Infinity;
  for (const p of points) {
    south = Math.min(south, p.lat);
    west = Math.min(west, p.lng);
    north = Math.max(north, p.lat);
    east = Math.max(east, p.lng);
  }
  const pad = 0.003;
  return {
    south: south - pad,
    west: west - pad,
    north: north + pad,
    east: east + pad
  };
}

function parseSpeedTag(raw: string | undefined): number | null {
  if (!raw) return null;
  const num = Number(raw);
  if (!Number.isNaN(num)) return num;
  const mph = raw.match(/^(\d+)\s?mph$/i);
  return mph ? Math.round(Number(mph[1]) * 1.60934) : null;
}

function classifyRoadType(highwayValues: string[]): RoadType {
  if (highwayValues.length === 0) return 'unknown';
  const count = (match: string[]) => highwayValues.filter((h) => match.includes(h)).length;
  const major = count(['motorway', 'trunk', 'primary', 'motorway_link', 'trunk_link', 'primary_link']);
  const minor = count(['secondary', 'tertiary', 'secondary_link', 'tertiary_link']);
  const local = count(['unclassified', 'residential', 'service', 'track', 'living_street', 'road']);
  if (major >= minor && major >= local && major > 0) return 'highway';
  if (local > minor) return 'rural';
  return 'city';
}

function classifySurface(surfaceValues: string[]): RoadSurface {
  if (surfaceValues.length === 0) return 'unknown';
  const unpaved = surfaceValues.filter((s) =>
  ['unpaved', 'gravel', 'sand', 'dirt', 'ground', 'grass', 'cobblestone'].includes(s)).length;
  const paved = surfaceValues.filter((s) =>
  ['paved', 'asphalt', 'concrete', 'paving_stones'].includes(s)).length;
  if (unpaved > 0 && paved > 0) return 'mixed';
  if (unpaved > 0) return 'unpaved';
  if (paved > 0) return 'paved';
  return 'unknown';
}

export async function fetchRoadSnapshot(points: RoutePoint[]): Promise<RoadSnapshot | null> {
  const bbox = routeBoundingBox(points);
  if (!bbox) return null;
  const { south, west, north, east } = bbox;
  const query = `[out:json][timeout:8];(\nway["highway"](${south},${west},${north},${east});\n);\nout tags 120;`;
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 9000);
    const res = await fetch(OVERPASS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal
    });
    const data = await res.json() as OverpassResponse;
    window.clearTimeout(timer);

    const elements = Array.isArray(data?.elements) ? data.elements : [];
    const highwayValues: string[] = [];
    const surfaceValues: string[] = [];
    const speeds: number[] = [];
    for (const el of elements) {
      const tags = el?.tags;
      if (!tags) continue;
      if (typeof tags.highway === 'string') highwayValues.push(tags.highway);
      if (typeof tags.surface === 'string') surfaceValues.push(tags.surface);
      const speed = parseSpeedTag(tags.maxspeed);
      if (speed != null) speeds.push(speed);
    }
    if (highwayValues.length === 0) return null;
    const avgSpeed = speeds.length > 0
      ? Math.round(speeds.reduce((s, v) => s + v, 0) / speeds.length)
      : undefined;
    return {
      predominantRoadType: classifyRoadType(highwayValues),
      avgMaxSpeedKmph: avgSpeed,
      roadCount: elements.length,
      surface: classifySurface(surfaceValues)
    };
  } catch {
    return null;
  }
}

export function aqiLabel(aqi: number): { label: string; tone: 'success' | 'warn' | 'danger'; } {
  if (aqi <= 0) return { label: 'No data', tone: 'success' };
  if (aqi <= 50) return { label: 'Good', tone: 'success' };
  if (aqi <= 100) return { label: 'Moderate', tone: 'success' };
  if (aqi <= 150) return { label: 'Unhealthy (sensitive)', tone: 'warn' };
  if (aqi <= 300) return { label: 'Unhealthy', tone: 'danger' };
  return { label: 'Hazardous', tone: 'danger' };
}