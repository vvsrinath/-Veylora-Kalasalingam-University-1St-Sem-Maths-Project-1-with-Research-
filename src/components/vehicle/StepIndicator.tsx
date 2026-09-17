import React from 'react';

interface StepIndicatorProps {
  step: number;
  totalSteps: number;
  label: string;
}

export function StepIndicator({ step, totalSteps, label }: StepIndicatorProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-lighttext">{label}</span>
        <span className="text-lightmuted">
          {step}/{totalSteps}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-lightborder">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${step / totalSteps * 100}%` }} />
        
      </div>
    </div>);

}