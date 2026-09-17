import React from "react";
import { ArrowUpRightIcon, ArrowDownRightIcon, BoxIcon } from "lucide-react";
interface MetricCardProps {
  icon: BoxIcon;
  title: string;
  value: string;
  unit?: string;
  caption: string;
  trend?: {
    direction: 'up' | 'down';
    label: string;
    positive?: boolean;
  };
}
export function MetricCard({
  icon: Icon,
  title,
  value,
  unit,
  caption,
  trend
}: MetricCardProps) {
  return <div className="rounded-2xl border border-white/10 bg-surface/60 p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
        </div>
        {trend && <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend.positive ? 'text-success' : 'text-muted'}`}>
            {trend.direction === 'up' ? <ArrowUpRightIcon size={13} /> : <ArrowDownRightIcon size={13} />}
            {trend.label}
          </span>}
      </div>
      <p className="mt-4 text-sm font-medium text-muted">{title}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-soft">{value}</span>
        {unit && <span className="text-sm font-medium text-muted">{unit}</span>}
      </p>
      <p className="mt-1.5 text-xs text-muted">{caption}</p>
    </div>;
}