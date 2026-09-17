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
import { ArrowUpRightIcon } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

const RESEARCH_URL =
'https://github.com/vvsrinath/-Veylora-Kalasalingam-University-1St-Sem-Maths-Project-1-with-Research-/blob/main/RESEARCH.md';

const MODEL = {
  optimalSpeedKmh: 60,
  minimumConsumption: 7.8,
  secondDerivative: 0.004 };


const consumptionData = Array.from({ length: 61 }, (_, i) => {
  const speed = i * 2;
  return { speed, consumption: Number((0.002 * speed * speed - 0.24 * speed + 15).toFixed(3)) };
});

const derivativeData = Array.from({ length: 61 }, (_, i) => {
  const speed = i * 2;
  return { speed, derivative: Number((0.004 * speed - 0.24).toFixed(3)) };
});

const PURPOSE = [
{
  title: 'Main Objective',
  body: 'Model automobile fuel consumption as a function of vehicle speed and apply differentiation to determine the speed corresponding to minimum fuel consumption.'
},
{
  title: 'Problem Statement',
  body: 'Fuel consumption changes with driving speed and road conditions, but drivers rarely know the speed at which their vehicle achieves minimum consumption under specific conditions.'
}];


const RESEARCH_QUESTIONS = [
'How does fuel consumption change as vehicle speed increases?',
'Can fuel consumption be represented using a mathematical function?',
'At what speed does the model predict minimum consumption?',
'How can differentiation identify the critical speed?',
'How can the second derivative confirm a minimum?',
'How can the model be extended for different vehicles and roads?'];


const RESEARCH_OBJECTIVES = [
'Study the relationship between speed and fuel consumption.',
'Create a mathematical fuel-consumption function.',
'Plot the function using Python.',
'Calculate the first derivative.',
'Find the stationary or critical point.',
'Use the second derivative test.',
'Determine the minimum fuel-consumption value.',
'Compare fuel consumption at different speeds.',
'Visualize the optimal speed on a graph.',
'Build a foundation for future personalization.'];


const METHOD_STEPS = [
'Collect speed and fuel-consumption data from experiments, dashboards, refuelling records, or OBD devices.',
'Prepare a clean table of speed and fuel-consumption values.',
'Fit a mathematical function using quadratic or polynomial regression.',
'Differentiate to find the first derivative and set it to zero.',
'Confirm the minimum using the second derivative test.',
'Visualize the function, derivatives, and the optimal-speed marker.',
'Interpret the optimal speed within the tested range and model assumptions.'];


const FUTURE_WORK = [
'Vehicle profile and fuel-type comparison',
'Road-gradient and traffic-condition analysis',
'Weather, temperature, and maintenance inputs',
'Driving-behaviour and idle-time analysis',
'GPS-based speed and distance tracking',
'Fuel-cost and emission estimation',
'Multivariable differentiation and optimization',
'Machine-learning-based fuel prediction'];


export function ResearchSection() {
  return (
    <section id="research" className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted">
            Research
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-soft md:text-4xl">
            Project purpose &amp; research
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted md:text-lg">
            Veylora represents fuel consumption as a function of speed and applies differentiation to find the
            speed associated with minimum fuel consumption.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PURPOSE.map((item, i) =>
          <FadeIn key={item.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-soft">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </FadeIn>
          )}
          <FadeIn delay={0.12}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm font-semibold text-soft">Research Questions</h3>
              <ul className="mt-2 space-y-1.5">
                {RESEARCH_QUESTIONS.slice(0, 4).map((q) =>
              <li key={q} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {q}
                  </li>
              )}
              </ul>
            </div>
          </FadeIn>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <FadeIn>
            <div className="h-full rounded-3xl border border-white/10 bg-navydark/60 p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">The model</h3>
              <div className="mt-5 space-y-3">
                <Formula label="Consumption model" value="F(v) = av² + bv + c" />
                <Formula label="Illustrative model" value="F(v) = 0.002v² − 0.24v + 15" />
                <Formula label="First derivative" value="F′(v) = 0.004v − 0.24" />
                <Formula label="Second derivative" value="F″(v) = 0.004" />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                <Stat label="Optimal speed" value={`${MODEL.optimalSpeedKmh} km/h`} />
                <Stat label="Minimum" value={`${MODEL.minimumConsumption} units`} />
                <Stat label="F″(v)" value="> 0" />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Because <span className="font-mono">a &gt; 0</span>, the parabola opens upward and{' '}
                <span className="font-mono">F″(v) = 0.004 &gt; 0</span>, so the critical point at 60 km/h is a
                minimum.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="h-full rounded-3xl border border-white/10 bg-navydark/60 p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Visualization — fuel consumption
              </h3>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumptionData} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
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
                      width={36}
                      domain={['auto', 'auto']} />
                    
                    <Tooltip
                      formatter={(value: number) => [value.toFixed(2), 'F(v)']}
                      labelFormatter={(label) => `${label} km/h`}
                      contentStyle={{
                        background: '#0D2130',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        fontSize: 12,
                        color: '#F4F8FA'
                      }} />
                    
                    <ReferenceLine x={60} stroke="#2DD8A0" strokeDasharray="4 4" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="consumption" stroke="#38BDF8" strokeWidth={2.5} dot={false} />
                    <ReferenceDot x={60} y={7.8} r={6} fill="#2DD8A0" stroke="#0D2130" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Downward before 60 km/h, minimum at (60, 7.8), then upward — the expected upward-opening parabola.
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <FadeIn>
            <div className="h-full rounded-3xl border border-white/10 bg-navydark/60 p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Visualization — first derivative
              </h3>
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={derivativeData} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
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
                      width={36} />
                    
                    <Tooltip
                      formatter={(value: number) => [value.toFixed(2), "F'(v)"]}
                      labelFormatter={(label) => `${label} km/h`}
                      contentStyle={{
                        background: '#0D2130',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        fontSize: 12,
                        color: '#F4F8FA'
                      }} />
                    
                    <ReferenceLine y={0} stroke="#9AAEBB" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="derivative" stroke="#F5A524" strokeWidth={2.5} dot={false} />
                    <ReferenceDot x={60} y={0} r={6} fill="#2DD8A0" stroke="#0D2130" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                F′(v) is negative before 60 km/h, zero at the critical speed, and positive afterwards.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="h-full rounded-3xl border border-white/10 bg-navydark/60 p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Research methodology</h3>
              <ol className="mt-5 space-y-3">
                {METHOD_STEPS.map((step, i) =>
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                )}
              </ol>
            </div>
          </FadeIn>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Research objectives</h3>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {RESEARCH_OBJECTIVES.map((objective) =>
                <li key={objective} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {objective}
                  </li>
                )}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Future development</h3>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {FUTURE_WORK.map((item) =>
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent2" />
                    {item}
                  </li>
                )}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-10 text-center">
          <a
            href={RESEARCH_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition-opacity duration-150 hover:opacity-90">
            
            Read the full research details
            <ArrowUpRightIcon size={16} />
          </a>
        </FadeIn>
      </div>
    </section>);

}

function Formula({ label, value }: {label: string;value: string;}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy/50 p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1.5 font-mono text-base text-soft">{value}</p>
    </div>);

}

function Stat({ label, value }: {label: string;value: string;}) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-accent">{value}</p>
    </div>);

}
