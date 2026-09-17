import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MapIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { DataQualityBadge } from '../components/reports/DataQualityBadge';
import { RecommendationList } from '../components/reports/RecommendationList';
import { RoutePath } from '../components/trip/RoutePath';
import { Badge } from '../components/ui/Badge';
import { useAppData } from '../contexts/AppDataContext';
import { formatCurrency, formatDate, formatDuration } from '../utils/format';

export function TripReport() {
  const { tripId } = useParams<{tripId: string;}>();
  const { trips, vehicles } = useAppData();
  const trip = trips.find((t) => t.id === tripId);
  const vehicle = vehicles.find((v) => v.id === trip?.vehicleId);
  const [showRoute, setShowRoute] = useState(false);

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
  { label: 'CO₂ Saved', value: trip.co2SavedKg !== undefined ? `${trip.co2SavedKg} kg` : '—' }];


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
            {trip.source}
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

        <div className="mt-5">
          <DataQualityBadge quality={trip.dataQuality} reasons={trip.dataQualityReasons} />
        </div>

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