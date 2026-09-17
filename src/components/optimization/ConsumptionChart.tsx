import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ReferenceLine } from
'recharts';
import { ConsumptionModel, buildCurvePoints } from '../../utils/fuelMath';

interface ConsumptionChartProps {
  model: ConsumptionModel;
}

export function ConsumptionChart({ model }: ConsumptionChartProps) {
  const points = buildCurvePoints(model);

  return (
    <div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="speed"
              stroke="#9AAEBB"
              tick={{ fontSize: 11, fill: '#9AAEBB' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              label={{ value: 'Speed (km/h)', position: 'insideBottom', offset: -2, fill: '#9AAEBB', fontSize: 11 }} />
            
            <YAxis
              stroke="#9AAEBB"
              tick={{ fontSize: 11, fill: '#9AAEBB' }}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{ value: 'L/100km', angle: -90, position: 'insideLeft', fill: '#9AAEBB', fontSize: 11 }} />
            
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} L/100km`, 'Consumption']}
              labelFormatter={(label) => `${label} km/h`}
              contentStyle={{
                background: '#0D2130',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontSize: 12,
                color: '#F4F8FA'
              }} />
            
            <ReferenceLine
              x={model.optimalSpeedKmh}
              stroke="#2DD8A0"
              strokeDasharray="4 4"
              strokeWidth={1.5} />
            
            <Line type="monotone" dataKey="consumption" stroke="#38BDF8" strokeWidth={2.5} dot={false} />
            <ReferenceDot
              x={model.optimalSpeedKmh}
              y={model.minConsumptionL100km}
              r={6}
              fill="#2DD8A0"
              stroke="#0D2130"
              strokeWidth={2} />
            
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-muted">Estimated minimum:</span>
        <span className="font-semibold text-soft">{model.optimalSpeedKmh} km/h</span>
      </div>
    </div>);

}