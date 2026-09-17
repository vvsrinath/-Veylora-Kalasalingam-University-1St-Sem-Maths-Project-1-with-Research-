import React, { useMemo, useState } from 'react';
import { ZapIcon, MountainIcon } from 'lucide-react';
import { PhysicsSpec, roadLoadForceN, powerRequiredW, slopeForceN, rollingResistanceForceN, aerodynamicDragN } from '../../utils/physicsMath';

interface PhysicsPanelProps {
  spec: PhysicsSpec;
  speedKmh: number;
}

const round = (n: number) => Math.round(n); // .toLocaleString below

export function PhysicsPanel({ spec, speedKmh }: PhysicsPanelProps) {
  const [grade, setGrade] = useState(0);

  const forces = useMemo(() => {
    const slope = slopeForceN(spec.massKg, grade);
    const rolling = rollingResistanceForceN(spec.massKg, grade, spec.rollingCoefficient);
    const drag = aerodynamicDragN(speedKmh, spec.dragCoefficient, spec.frontalAreaM2);
    const total = roadLoadForceN(spec, speedKmh, grade);
    const power = powerRequiredW(total, speedKmh);
    return { slope, rolling, drag, total, power };
  }, [spec, grade, speedKmh]);

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/60 p-5 md:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <ZapIcon size={18} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-soft">Road-load physics</h2>
          <p className="text-xs text-muted">Forces acting on the vehicle at {Math.round(speedKmh)} km/h</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted">
        <span className="rounded-lg bg-white/5 px-2.5 py-1">m = {spec.massKg.toLocaleString()} kg</span>
        <span className="rounded-lg bg-white/5 px-2.5 py-1">C<sub>d</sub> = {spec.dragCoefficient}</span>
        <span className="rounded-lg bg-white/5 px-2.5 py-1">A = {spec.frontalAreaM2.toFixed(1)} m²</span>
        <span className="rounded-lg bg-white/5 px-2.5 py-1">C<sub>rr</sub> = {spec.rollingCoefficient}</span>
      </div>

      <div className="mt-5">
        <label className="flex items-center justify-between text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <MountainIcon size={14} />
            Road gradient
          </span>
          <span className="font-semibold text-soft">{grade}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={grade}
          onChange={(e) => setGrade(Number(e.target.value))}
          className="mt-2 w-full accent-accent" />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <ForceRow label="Aerodynamic drag" value={forces.drag} unit="N" />
        <ForceRow label="Rolling resistance" value={forces.rolling} unit="N" />
        <ForceRow label="Slope force" value={forces.slope} unit="N" />
        <ForceRow label="Total road load" value={forces.total} unit="N" />
        <ForceRow label="Power required" value={forces.power} unit="W" accent />
      </dl>

      <p className="mt-4 rounded-xl bg-white/5 p-3.5 text-xs leading-relaxed text-muted">
        F<sub>rolling</sub> = C<sub>rr</sub>mg·cos(θ)&nbsp;&nbsp; F<sub>slope</sub> = mg·sin(θ)&nbsp;&nbsp;
        F<sub>drag</sub> = ½ρC<sub>d</sub>Av²&nbsp;&nbsp; P = F<sub>total</sub>·v
      </p>
    </div>);

}

function ForceRow({ label, value, unit, accent }: {label: string; value: number; unit: string; accent?: boolean;}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className={`mt-0.5 font-bold tabular-nums ${accent ? 'text-accent' : 'text-soft'}`}>
        {round(value).toLocaleString()} {unit}
      </dd>
    </div>);

}