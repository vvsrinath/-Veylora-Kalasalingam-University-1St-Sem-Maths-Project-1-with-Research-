import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GaugeIcon, ActivityIcon, WalletIcon, TrendingUpIcon, ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { MetricCard } from '../components/dashboard/MetricCard';
import { VehicleSwitcher } from '../components/dashboard/VehicleSwitcher';
import { Button } from '../components/ui/Button';
import { useAppData } from '../contexts/AppDataContext';
import { getConsumptionModel } from '../utils/fuelMath';
import { formatCurrency, formatDistance, formatRelativeDay, formatSpeed } from '../utils/format';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const { activeVehicle, tripsForActiveVehicle } = useAppData();

  const metrics = useMemo(() => {
    const trips = tripsForActiveVehicle.slice(0, 6);
    const withMileage = trips.filter((t) => t.mileageKmL);
    const avgMileage = withMileage.length ?
    withMileage.reduce((sum, t) => sum + (t.mileageKmL || 0), 0) / withMileage.length :
    activeVehicle.userObservedMileage || activeVehicle.manufacturerMileage;

    const avgSpeed = trips.length ?
    trips.reduce((sum, t) => sum + t.avgSpeedKmh, 0) / trips.length :
    0;

    const withCost = trips.filter((t) => t.costPerKm);
    const avgCostPerKm = withCost.length ?
    withCost.reduce((sum, t) => sum + (t.costPerKm || 0), 0) / withCost.length :
    0;

    const model = getConsumptionModel(activeVehicle);

    return { avgMileage, avgSpeed, avgCostPerKm, optimalSpeed: model.optimalSpeedKmh };
  }, [tripsForActiveVehicle, activeVehicle]);

  const recentTrips = tripsForActiveVehicle.slice(0, 3);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight text-soft md:text-3xl">{getGreeting()}</p>
            <p className="mt-1 text-sm text-muted">Ready for a smarter drive?</p>
            <div className="mt-4">
              <VehicleSwitcher />
            </div>
          </div>
          <Link to="/trip/start">
            <Button size="lg" className="w-full md:w-auto">
              Start Trip
              <ArrowRightIcon size={18} />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            icon={GaugeIcon}
            title="Current Mileage"
            value={metrics.avgMileage.toFixed(1)}
            unit="km/L"
            caption="Based on recorded trips" />
          
          <MetricCard
            icon={ActivityIcon}
            title="Average Speed"
            value={Math.round(metrics.avgSpeed).toString()}
            unit="km/h"
            caption="Across recent trips" />
          
          <MetricCard
            icon={WalletIcon}
            title="Fuel Cost"
            value={metrics.avgCostPerKm ? metrics.avgCostPerKm.toFixed(2) : '—'}
            unit="₹/km"
            caption="Average cost per kilometre" />
          
          <MetricCard
            icon={TrendingUpIcon}
            title="Optimal Speed"
            value={metrics.optimalSpeed.toString()}
            unit="km/h"
            caption="Estimated minimum-consumption speed" />
          
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-surface/60 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-soft">Recent trips</h2>
              <Link to="/trip/history" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                View all
                <ChevronRightIcon size={15} />
              </Link>
            </div>

            {recentTrips.length === 0 ?
            <p className="mt-6 text-sm text-muted">
                No trips recorded yet. Start a trip to see it appear here.
              </p> :

            <ul className="mt-4 divide-y divide-white/10">
                {recentTrips.map((trip) =>
              <li key={trip.id}>
                    <Link
                  to={`/trip/report/${trip.id}`}
                  className="flex items-center justify-between gap-4 py-3.5 transition-colors duration-150 hover:bg-white/5 -mx-2 px-2 rounded-lg">
                  
                      <div>
                        <p className="text-sm font-medium text-soft">{formatDistance(trip.distanceKm)}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatRelativeDay(trip.date)} · {formatSpeed(trip.avgSpeedKmh)} avg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-soft">
                          {trip.mileageKmL ? `${trip.mileageKmL.toFixed(1)} km/L` : '—'}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {trip.fuelCost ? formatCurrency(trip.fuelCost) : '—'}
                        </p>
                      </div>
                    </Link>
                  </li>
              )}
              </ul>
            }
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface/60 p-6">
            <h2 className="text-base font-semibold text-soft">Your vehicle</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Odometer</dt>
                <dd className="font-medium text-soft">{activeVehicle.odometerKm.toLocaleString()} km</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Age</dt>
                <dd className="font-medium text-soft">{activeVehicle.ageYears} yrs</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Tank capacity</dt>
                <dd className="font-medium text-soft">{activeVehicle.tankCapacityL} L</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Condition</dt>
                <dd className="font-medium text-soft capitalize">{activeVehicle.condition.replace('-', ' ')}</dd>
              </div>
            </dl>
            <Link
              to="/my-vehicles"
              className="mt-5 flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              
              Manage vehicles
              <ChevronRightIcon size={15} />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>);

}