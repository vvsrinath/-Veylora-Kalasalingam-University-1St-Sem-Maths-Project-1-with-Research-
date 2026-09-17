import React, { useMemo } from 'react';
import { GaugeIcon, TrendingDownIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ConsumptionChart } from '../components/optimization/ConsumptionChart';
import { CalculusPanel } from '../components/optimization/CalculusPanel';
import { useAppData } from '../contexts/AppDataContext';
import { getConsumptionModel, consumptionAtSpeed } from '../utils/fuelMath';

export function Optimization() {
  const { activeVehicle, tripsForActiveVehicle } = useAppData();
  const model = useMemo(() => getConsumptionModel(activeVehicle), [activeVehicle]);

  const currentAvgSpeed = useMemo(() => {
    const recent = tripsForActiveVehicle.slice(0, 6);
    if (recent.length === 0) return null;
    return recent.reduce((sum, t) => sum + t.avgSpeedKmh, 0) / recent.length;
  }, [tripsForActiveVehicle]);

  const savingsPercent = useMemo(() => {
    if (!currentAvgSpeed) return null;
    const currentConsumption = consumptionAtSpeed(model, currentAvgSpeed);
    if (currentConsumption <= 0) return null;
    const diff = (currentConsumption - model.minConsumptionL100km) / currentConsumption * 100;
    return Math.max(0, Math.round(diff));
  }, [currentAvgSpeed, model]);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-8 md:py-12">
        <h1 className="text-2xl font-bold tracking-tight text-soft">Your Speed Optimization</h1>
        <p className="mt-1.5 text-sm text-muted md:text-base">
          Explore how your vehicle's speed may affect fuel consumption.
        </p>

        <div className="mt-7 rounded-3xl border border-white/10 bg-surface/60 p-5 md:p-7">
          <ConsumptionChart model={model} />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-surface/60 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <GaugeIcon size={18} />
            </span>
            <p className="text-sm leading-relaxed text-muted">
              At <span className="font-semibold text-soft">{model.optimalSpeedKmh} km/h</span>, this vehicle's
              model estimates its lowest fuel consumption. Driving at a steadier speed near this range may reduce
              estimated fuel use.
            </p>
          </div>

          {savingsPercent !== null && savingsPercent > 0 ?
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-surface/60 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                <TrendingDownIcon size={18} />
              </span>
              <div>
                <p className="text-2xl font-bold text-soft">≈{savingsPercent}%</p>
                <p className="mt-1 text-xs text-muted">
                  Estimated reduction vs. your recent average speed of {Math.round(currentAvgSpeed || 0)} km/h.
                </p>
              </div>
            </div> :

          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-surface/60 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-muted">
                <TrendingDownIcon size={18} />
              </span>
              <p className="text-sm leading-relaxed text-muted">
                Record a few trips to see how your average speed compares to the estimated optimal speed.
              </p>
            </div>
          }
        </div>

        <div className="mt-5">
          <CalculusPanel model={model} />
        </div>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          This curve is a simplified model, not a guarantee of fuel savings. It's seeded from your vehicle's type,
          fuel, age, and maintenance condition, and improves as more of your own trip data is recorded.
        </p>
      </div>
    </AppShell>);

}