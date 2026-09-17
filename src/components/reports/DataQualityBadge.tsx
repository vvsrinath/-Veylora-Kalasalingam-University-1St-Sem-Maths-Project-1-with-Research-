import React from 'react';
import { ShieldCheckIcon, ShieldIcon, ShieldAlertIcon } from 'lucide-react';
import { DataQuality } from '../../types/trip';

interface DataQualityBadgeProps {
  quality: DataQuality;
  reasons: string[];
}

const CONFIG: Record<DataQuality, {label: string;icon: typeof ShieldCheckIcon;classes: string;}> = {
  high: { label: 'High confidence', icon: ShieldCheckIcon, classes: 'bg-accent/10 text-emerald-700' },
  medium: { label: 'Medium confidence', icon: ShieldIcon, classes: 'bg-warn/10 text-amber-700' },
  low: { label: 'Low confidence', icon: ShieldAlertIcon, classes: 'bg-danger/10 text-red-700' }
};

export function DataQualityBadge({ quality, reasons }: DataQualityBadgeProps) {
  const config = CONFIG[quality];
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-lightborder bg-white p-4">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}>
        <Icon size={14} />
        {config.label}
      </span>
      {reasons.length > 0 &&
      <ul className="mt-3 space-y-1.5">
          {reasons.map((reason) =>
        <li key={reason} className="flex items-start gap-2 text-xs text-lightmuted">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-lightmuted" />
              {reason}
            </li>
        )}
        </ul>
      }
    </div>);

}