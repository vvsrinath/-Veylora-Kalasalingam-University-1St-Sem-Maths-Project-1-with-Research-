import React, { useState } from 'react';
import { ChevronDownIcon, FunctionSquareIcon } from 'lucide-react';
import { ConsumptionModel } from '../../utils/fuelMath';

interface CalculusPanelProps {
  model: ConsumptionModel;
}

export function CalculusPanel({ model }: CalculusPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        
        <span className="flex items-center gap-2.5 text-sm font-semibold text-soft">
          <FunctionSquareIcon size={17} className="text-accent" />
          How the math works
        </span>
        <ChevronDownIcon
          size={18}
          className={`text-muted transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`} />
        
      </button>

      {open &&
      <div className="space-y-5 border-t border-white/10 px-5 py-5 text-sm leading-relaxed text-muted">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted/80">Fuel-consumption model</p>
            <p className="mt-2 font-mono text-base text-soft">F(v) = av² + bv + c</p>
            <p className="mt-1.5">
              F(v) estimates fuel consumption (L/100km) at speed v. It's a simplified curve — very low and very high
              speeds tend to use more fuel than a moderate cruising speed.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted/80">First derivative</p>
            <p className="mt-2 font-mono text-base text-soft">F'(v) = 2av + b</p>
            <p className="mt-1.5">The derivative tells us how consumption changes as speed changes.</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted/80">Minimum point</p>
            <p className="mt-2 font-mono text-base text-soft">F'(v) = 0 → v_optimal = −b / 2a</p>
            <p className="mt-1.5">
              Setting the derivative to zero finds the speed where consumption stops decreasing — for this vehicle,
              that's an estimated <span className="font-semibold text-soft">{model.optimalSpeedKmh} km/h</span>.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted/80">Verification</p>
            <p className="mt-2 font-mono text-base text-soft">F''(v) &gt; 0</p>
            <p className="mt-1.5">
              A positive second derivative confirms this point is a minimum, not a maximum, of the curve.
            </p>
          </div>

          <p className="rounded-xl bg-white/5 p-3.5 text-xs text-muted">
            This is a simplified model, not a universal law — it's seeded from your vehicle's type, fuel, age, and
            condition. It can be improved further as more of your real trip data is recorded.
          </p>
        </div>
      }
    </div>);

}