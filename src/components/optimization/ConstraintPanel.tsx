import React, { useMemo, useState } from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { recommendedSpeedKmh, RoadConditionFactor, WeatherConditionFactor, TrafficConditionFactor } from '../../utils/optimizationMath';
import { speedDifferenceKmh } from '../../utils/fuelMath';

interface ConstraintPanelProps {
  optimalSpeedKmh: number;
  currentAvgSpeedKmh: number | null;
}

const ROADS: RoadConditionFactor[] = ['highway', 'city', 'rural'];
const WEATHERS: WeatherConditionFactor[] = ['clear', 'rain', 'fog'];
const TRAFFICS: TrafficConditionFactor[] = ['free-flow', 'moderate', 'heavy'];

export function ConstraintPanel({ optimalSpeedKmh, currentAvgSpeedKmh }: ConstraintPanelProps) {
  const [legalLimit, setLegalLimit] = useState('60');
  const [road, setRoad] = useState<RoadConditionFactor>('city');
  const [weather, setWeather] = useState<WeatherConditionFactor>('clear');
  const [traffic, setTraffic] = useState<TrafficConditionFactor>('free-flow');

  const recommended = useMemo(() =>
  recommendedSpeedKmh(optimalSpeedKmh, {
    legalLimitKmh: Number(legalLimit) || undefined,
    road,
    weather,
    traffic }) as number,
  [optimalSpeedKmh, legalLimit, road, weather, traffic]);

  const limitedBy = () => {
    const caps = [
      { label: 'legal limit', value: Number(legalLimit) || Infinity },
      { label: `road (${road})`, value: road === 'highway' ? 100 : road === 'city' ? 60 : 80 },
      { label: `weather (${weather})`, value: weather === 'clear' ? Infinity : weather === 'rain' ? 80 : 60 },
      { label: `traffic (${traffic})`, value: traffic === 'free-flow' ? Infinity : traffic === 'moderate' ? 70 : 45 }
    ];
    const limiter = caps.reduce((min, c) => c.value < min.value ? c : min, caps[0]);
    return limiter.value < optimalSpeedKmh ? limiter.label : 'model optimum';
  };

  const speedDiff = currentAvgSpeedKmh != null ? speedDifferenceKmh(currentAvgSpeedKmh, optimalSpeedKmh) : null;
  const selectClass =
  'rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-soft focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/60 p-5 md:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 text-success">
          <ShieldCheckIcon size={18} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-soft">Recommended speed with constraints</h2>
          <p className="text-xs text-muted">v_recommended ≤ v_legal, road, weather &amp; traffic caps</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-muted">Legal limit (km/h)</span>
          <input
            type="number"
            min={10}
            value={legalLimit}
            onChange={(e) => setLegalLimit(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-soft focus:outline-none focus:ring-2 focus:ring-accent" />
        </label>
        <label className="block">
          <span className="text-xs text-muted">Road type</span>
          <select value={road} onChange={(e) => setRoad(e.target.value as RoadConditionFactor)} className={`mt-1 w-full ${selectClass}`}>
            {ROADS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-muted">Weather</span>
          <select value={weather} onChange={(e) => setWeather(e.target.value as WeatherConditionFactor)} className={`mt-1 w-full ${selectClass}`}>
            {WEATHERS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-muted">Traffic</span>
          <select value={traffic} onChange={(e) => setTraffic(e.target.value as TrafficConditionFactor)} className={`mt-1 w-full ${selectClass}`}>
            {TRAFFICS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div>
          <p className="text-[11px] text-muted">Recommended speed</p>
          <p className="text-2xl font-bold tabular-nums text-soft">{Math.round(recommended)} km/h</p>
        </div>
        <p className="max-w-[180px] text-right text-xs text-muted">
          Capped by the <span className="font-semibold text-soft">{limitedBy()}</span>
        </p>
      </div>

      {speedDiff != null &&
      <p className="mt-3 text-xs leading-relaxed text-muted">
          Your recent average speed is{' '}
          <span className={`font-semibold ${Math.abs(speedDiff) > 10 ? 'text-warn' : 'text-success'}`}>
            {speedDiff > 0 ? '+' : ''}{Math.round(speedDiff)} km/h
          </span>{' '}
          {speedDiff > 0 ? 'above' : 'below'} the model's estimated optimal speed.
        </p>
      }
    </div>);

}