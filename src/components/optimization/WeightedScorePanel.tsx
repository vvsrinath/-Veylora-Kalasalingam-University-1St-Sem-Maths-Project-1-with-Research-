import React, { useMemo, useState } from 'react';
import { TargetIcon } from 'lucide-react';
import { Trip } from '../../types/trip';
import { tripStats } from '../../utils/tripStats';
import { formatDate, formatDistance } from '../../utils/format';

interface WeightedScorePanelProps {
  trips: Trip[];
}

function goodness(value: number, better: 'high' | 'low', best: number, worst: number): number {
  if (best === worst) return 1;
  if (better === 'high') return (value - worst) / (best - worst);
  return (best - value) / (best - worst);
}

const DEFAULT_WEIGHTS = { fuel: 25, cost: 25, time: 25, wear: 25 };

export function WeightedScorePanel({ trips }: WeightedScorePanelProps) {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const totalWeight = weights.fuel + weights.cost + weights.time + weights.wear;

  const analyse = useMemo(() => {
    const candidates = trips.slice(0, 8).map((trip) => {
      const harsh = tripStats(trip).harsh;
      return {
        trip,
        fuel: trip.consumptionL100km,
        cost: trip.costPerKm,
        time: trip.durationSec > 0 ? trip.durationSec : undefined,
        wear: harsh
          ? harsh.accelerations + harsh.brakings
          : 0
      };
    });

    const withFuel = candidates.map((c) => c.fuel).filter((v): v is number => v != null);
    const withCost = candidates.map((c) => c.cost).filter((v): v is number => v != null);
    const withTime = candidates.map((c) => c.time).filter((v): v is number => v != null);
    const withWear = candidates.map((c) => c.wear);

    const range = (arr: number[]) =>
    arr.length > 0
      ? { best: Math.min(...arr), worst: Math.max(...arr) }
      : { best: 0, worst: 0 };

    const fuelRange = range(withFuel);
    const costRange = range(withCost);
    const timeRange = range(withTime);
    const wearRange = range(withWear);

    const rows = candidates.map((c) => {
      const f = c.fuel != null && fuelRange.best !== fuelRange.worst ?
        goodness(c.fuel, 'low', fuelRange.best, fuelRange.worst) : 1;
      const co = c.cost != null && costRange.best !== costRange.worst ?
        goodness(c.cost, 'low', costRange.best, costRange.worst) : 1;
      const t = c.time != null && timeRange.best !== timeRange.worst ?
        goodness(c.time, 'low', timeRange.best, timeRange.worst) : 1;
      const w = wearRange.best !== wearRange.worst ?
        goodness(c.wear, 'low', wearRange.best, wearRange.worst) : 1;
      return {
        trip: c.trip,
        fuel: c.fuel != null ? f : null,
        cost: c.cost != null ? co : null,
        time: c.time != null ? t : null,
        wear: w,
        unitsAvailable: c.fuel != null && c.cost != null
      };
    });

    return { rows, fuelRange, costRange, timeRange, wearRange };
  }, [trips]);

  const scored = useMemo(() => {
    const w = (k: keyof typeof weights) => weights[k] / (totalWeight || 1);
    return analyse.rows.map((r) => {
      const parts = {
        fuel: r.fuel ?? 0,
        cost: r.cost ?? 0,
        time: r.time ?? 0,
        wear: r.wear
      };
      const score = w('fuel') * parts.fuel + w('cost') * parts.cost + w('time') * parts.time + w('wear') * parts.wear;
      const metricKeys = ['fuel', 'cost', 'time', 'wear'] as const;
      const available = metricKeys.filter((k) => r[k] != null);
      const top = available.reduce((best, k) => parts[k] > parts[best] ? k : best, available[0]);
      return { trip: r.trip, score: score * 100, top, unitsAvailable: r.unitsAvailable };
    }).sort((a, b) => b.score - a.score);
  }, [analyse, weights, totalWeight]);

  const w = (k: keyof typeof weights) => weights[k];
  const weightInputs: { key: keyof typeof weights; label: string; }[] = [
    { key: 'fuel', label: 'Fuel (E)' },
    { key: 'cost', label: 'Cost (C)' },
    { key: 'time', label: 'Time (T)' },
    { key: 'wear', label: 'Wear (M)' }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/60 p-5 md:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <TargetIcon size={18} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-soft">Normalized optimization score</h2>
          <p className="text-xs text-muted">J = w<sub>1</sub>E + w<sub>2</sub>C + w<sub>3</sub>T + w<sub>4</sub>M, weights sum to 1</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {weightInputs.map(({ key, label }) =>
        <label key={key} className="block">
            <span className="flex items-center justify-between text-xs text-muted">
              <span>{label}</span>
              <span className="font-semibold text-soft">{w(key)}%</span>
            </span>
            <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={w(key)}
          onChange={(e) => setWeights((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
          className="mt-1.5 w-full accent-accent" />
          </label>
        )}
      </div>

      {scored.length === 0 ?
      <p className="mt-4 text-sm text-muted">Record a few trips to see the normalized score comparison.</p> :

      <>
          <ul className="mt-5 divide-y divide-white/10">
            {scored.slice(0, 6).map(({ trip, score, top, unitsAvailable }) =>
        <li key={trip.id} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-soft">{formatDistance(trip.distanceKm)}</p>
                <p className="mt-0.5 text-xs text-muted">{formatDate(trip.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums text-soft">{score.toFixed(0)}/100</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {unitsAvailable ? `best: ${top}` : 'needs fuel data'}
                </p>
              </div>
            </li>
        )}
          </ul>
          <p className="mt-3 rounded-xl bg-white/5 p-3.5 text-xs leading-relaxed text-muted">
            Each trip's metrics are normalized between the best and worst values seen in your recent trips, so
            different units (L/100km, ₹, seconds, events) can be combined into one score J.
          </p>
        </>
      }
    </div>);

}