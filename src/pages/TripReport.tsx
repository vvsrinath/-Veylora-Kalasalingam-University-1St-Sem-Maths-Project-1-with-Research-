import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MapIcon, MapPinIcon, ThermometerIcon, CloudFogIcon, RouteIcon, GlobeIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { DataQualityBadge } from '../components/reports/DataQualityBadge';
import { RecommendationList } from '../components/reports/RecommendationList';
import { RoutePath } from '../components/trip/RoutePath';
import { Badge } from '../components/ui/Badge';
import { useAppData } from '../contexts/AppDataContext';
import { tripStats } from '../utils/tripStats';
import { estimatedEmissionsKg, tripEnergyMJ } from '../utils/costEmissionMaintenance';
import { aqiLabel } from '../utils/environmentApi';
import { countries, countryByCode, tripCostInCountry, costInInr } from '../data/countries';
import { formatCurrency, formatDate, formatDuration } from '../utils/format';

export function TripReport() {
  const { tripId } = useParams<{tripId: string;}>();
  const { trips, vehicles } = useAppData();
  const trip = trips.find((t) => t.id === tripId);
  const vehicle = vehicles.find((v) => v.id === trip?.vehicleId);
  const [showRoute, setShowRoute] = useState(false);
  const [countryCode, setCountryCode] = useState(trip?.geoContext?.countryCode ?? 'IN');
  const hostCountry = trip?.geoContext?.countryCode ? countryByCode(trip.geoContext.countryCode) : undefined;
  const comparisonCountry = countryByCode(countryCode);

  if (!trip || !vehicle) {
    return (
      <AppShell background="bg-soft">
        <div className="mx-auto max-w-lg px-6 py-16 text-center">
          <p className="text-sm text-lightmuted">This trip could not be found.</p>
          <Link to="/trip/history" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Back to Trip History
          </Link>
        </div>
      </AppShell>);

  }

  const metrics = [
  { label: 'Distance', value: `${trip.distanceKm.toFixed(1)} km` },
  { label: 'Duration', value: formatDuration(trip.durationSec) },
  { label: 'Avg Speed', value: `${Math.round(trip.avgSpeedKmh)} km/h` },
  { label: 'Max Speed', value: `${Math.round(trip.maxSpeedKmh)} km/h` },
  { label: 'Fuel Used', value: trip.fuelUsedL ? `${trip.fuelUsedL.toFixed(1)} L` : '—' },
  { label: 'Mileage', value: trip.mileageKmL ? `${trip.mileageKmL.toFixed(1)} km/L` : '—' },
  { label: 'Consumption', value: trip.consumptionL100km ? `${trip.consumptionL100km.toFixed(1)} L/100km` : '—' },
  { label: 'Fuel Cost', value: trip.fuelCost ? formatCurrency(trip.fuelCost) : '—' },
  { label: 'Cost / km', value: trip.costPerKm ? formatCurrency(trip.costPerKm) : '—' },
  { label: 'CO₂ Saved', value: trip.co2SavedKg !== undefined ? `${trip.co2SavedKg} kg` : '—' },
  { label: 'GPS Accuracy', value: trip.avgAccuracyM != null ? `±${trip.avgAccuracyM} m` : '—' }];


  const stats = tripStats(trip);
  const derivedMetrics = [
  trip.fuelUsedL && vehicle ?
  { label: 'CO₂ Emitted', value: `${estimatedEmissionsKg(trip.fuelUsedL, vehicle.fuelType)} kg` } : null,
  trip.fuelUsedL && vehicle ?
  { label: 'Trip Energy', value: `${tripEnergyMJ(trip.fuelUsedL, vehicle.fuelType)} MJ` } : null,
  stats.variation ?
  { label: 'Speed Variation', value: `${Math.round(stats.variation.variationKmh)} km/h` } : null,
  stats.avgAccelerationMps2 != null ?
  { label: 'Avg Acceleration', value: `${stats.avgAccelerationMps2.toFixed(2)} m/s²` } : null,
  stats.idling ?
  { label: 'Idling', value: `${stats.idling.idleTimeSec}s · ${stats.idling.idlePercent.toFixed(0)}%` } : null,
  stats.harsh ?
  { label: 'Harsh Events', value: `${stats.harsh.accelerations} accel · ${stats.harsh.brakings} brake` } : null].
  filter((m): m is {label: string;value: string;} => m !== null);

  const hasContext = Boolean(trip.geoContext || trip.environment || trip.road);
  const comparisonFuelCost = comparisonCountry && trip.fuelUsedL
    ? tripCostInCountry(trip.fuelUsedL, comparisonCountry)
    : null;
  const comparisonInr = comparisonCountry && comparisonFuelCost != null
    ? costInInr(comparisonFuelCost, comparisonCountry)
    : null;

  const contextRows = [
  trip.geoContext ?
  {
    icon: MapPinIcon,
    label: 'Location',
    value: [trip.geoContext.city, trip.geoContext.state, trip.geoContext.country].
    filter(Boolean).join(', ') || trip.geoContext.country
  } : null,
  trip.geoContext?.elevationM != null ?
  { icon: MapPinIcon, label: 'Elevation', value: `${trip.geoContext.elevationM} m` } : null,
  trip.environment ?
  {
    icon: ThermometerIcon,
    label: 'Temperature (start)',
    value: `${Math.round(trip.environment.temperatureC)}°C · feels ${Math.round(trip.environment.feelsLikeC)}°C`
  } : null,
  trip.environmentEnd ?
  {
    icon: ThermometerIcon,
    label: 'Temperature (end)',
    value: `${Math.round(trip.environmentEnd.temperatureC)}°C`
  } : null,
  trip.environment && trip.environment.aqi > 0 ?
  {
    icon: CloudFogIcon,
    label: 'Air quality (start)',
    value: `AQI ${trip.environment.aqi} · ${aqiLabel(trip.environment.aqi).label}`
  } : null,
  trip.road ?
  {
    icon: RouteIcon,
    label: 'Road type',
    value: `${trip.road.predominantRoadType}${trip.road.avgMaxSpeedKmph ? ` · ~${trip.road.avgMaxSpeedKmph} km/h limit` : ''}`
  } : null,
  trip.road ?
  { icon: RouteIcon, label: 'Road surface', value: `${trip.road.surface} · ${trip.road.roadCount} segments` } : null].
  filter((r): r is {icon: typeof MapPinIcon;label: string;value: string;} => r !== null);


  return (
    <AppShell background="bg-soft">
      <div className="mx-auto max-w-2xl px-6 py-8 md:py-12">
        <Link to="/trip/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-lightmuted hover:text-lighttext">
          <ArrowLeftIcon size={16} />
          Trip History
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-lighttext">Trip Summary</h1>
            <p className="mt-0.5 text-sm text-lightmuted">{formatDate(trip.date)}</p>
          </div>
          <Badge theme="light" tone="success" className="capitalize">
            {trip.gpsSource === 'simulated' ? 'Estimated (simulated GPS)' : trip.source}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {metrics.map((m) =>
          <div key={m.label} className="rounded-2xl border border-lightborder bg-white p-4">
              <p className="text-[11px] font-medium text-lightmuted">{m.label}</p>
              <p className="mt-1 text-lg font-bold text-lighttext">{m.value}</p>
            </div>
          )}
        </div>

        {derivedMetrics.length > 0 &&
        <div className="mt-6">
            <h2 className="text-sm font-semibold text-lighttext">Movement & emissions analysis</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {derivedMetrics.map((m) =>
            <div key={m.label} className="rounded-2xl border border-lightborder bg-white p-4">
                  <p className="text-[11px] font-medium text-lightmuted">{m.label}</p>
                  <p className="mt-1 text-base font-bold text-lighttext">{m.value}</p>
                </div>
            )}
            </div>
            {stats.samplesCount < 2 &&
          <p className="mt-3 text-xs text-lightmuted">
                Speed-sample analysis needs at least two recorded GPS speed samples. Trips logged manually don't
                capture acceleration and idling.
              </p>
          }
          </div>
        }

        <div className="mt-5">
          <DataQualityBadge quality={trip.dataQuality} reasons={trip.dataQualityReasons} />
        </div>

        {hasContext && contextRows.length > 0 &&
        <div className="mt-6">
            <h2 className="text-sm font-semibold text-lighttext">Trip context (Live GPS)</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-lightborder bg-white">
              {contextRows.map((row) =>
            <div key={row.label} className="flex items-center justify-between gap-4 border-b border-lightborder px-4 py-3 last:border-b-0">
                  <span className="flex items-center gap-2.5 text-xs text-lightmuted">
                    <row.icon size={14} className="text-accent" />
                    {row.label}
                  </span>
                  <span className="text-right text-sm font-medium capitalize text-lighttext">{row.value}</span>
                </div>
            )}
            </div>
          </div>
        }

        {trip.fuelUsedL != null && trip.fuelUsedL > 0 && comparisonCountry &&
        <div className="mt-6">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-lighttext">
              <GlobeIcon size={15} className="text-accent" />
              Fuel cost by country
            </h2>
            <div className="mt-3 rounded-2xl border border-lightborder bg-white p-4">
              <label className="block">
                <span className="text-xs text-lightmuted">Compare this trip's {trip.fuelUsedL.toFixed(1)} L in</span>
                <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-lightborder bg-white px-3 py-2 text-sm text-lighttext focus:outline-none focus:ring-2 focus:ring-accent">
                  {countries.map((c) =>
              <option key={c.code} value={c.code}>
                      {c.name} — {c.currency} {c.petrolPerL.toFixed(2)}/L · {c.emissionNorm}
                    </option>
              )}
                </select>
              </label>
              {comparisonFuelCost != null &&
            <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-lightmuted">Estimated petrol cost</p>
                    <p className="text-xl font-bold text-lighttext">
                      {comparisonCountry.currencySymbol}
                      {comparisonFuelCost.toFixed(2)}
                      <span className="ml-1 text-sm font-medium text-lightmuted">{comparisonCountry.currency}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-lightmuted">≈ in ₹</p>
                    <p className="text-sm font-semibold text-lighttext">{formatCurrency(comparisonInr ?? 0)}</p>
                  </div>
                </div>
            }
              {hostCountry && hostCountry.code === comparisonCountry.code &&
            <p className="mt-2 text-xs text-accent">This is the country detected for your trip.</p>
            }
            </div>
          </div>
        }

        {trip.recommendations && trip.recommendations.length > 0 &&
        <div className="mt-5">
            <h2 className="mb-3 text-sm font-semibold text-lighttext">Recommendations</h2>
            <RecommendationList recommendations={trip.recommendations} theme="light" />
          </div>
        }

        {showRoute &&
        <div className="mt-5">
            <RoutePath progress={1} active={false} />
            <p className="mt-2 text-xs text-lightmuted">
              Simplified route trace shown offline. Full map tiles load automatically when you're online.
            </p>
          </div>
        }

        <div className="mt-6 flex gap-3">
          <Button variant="outline" theme="light" className="flex-1" onClick={() => setShowRoute((v) => !v)}>
            <MapIcon size={16} />
            {showRoute ? 'Hide Map' : 'View on Map'}
          </Button>
          <Link to="/dashboard" className="flex-1">
            <Button className="w-full">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </AppShell>);

}