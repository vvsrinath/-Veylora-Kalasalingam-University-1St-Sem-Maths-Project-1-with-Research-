import React from 'react';
import { FadeIn } from '../ui/FadeIn';

const MODEL = [
{ label: 'Consumption model', formula: 'F(v) = av\u00B2 + bv + c' },
{ label: 'Critical speed (first derivative)', formula: 'F\u2032(v) = 2av + b = 0' },
{ label: 'Nature of the point (second derivative)', formula: 'F\u2033(v) = 2a' }];


export function AboutSection() {
  return (
    <section id="about" className="bg-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-lightborder/70 px-3 py-1 text-xs font-medium text-lightmuted">
              About Veylora
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-lighttext md:text-4xl">
              A mathematical approach to fuel efficiency
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-lightmuted md:text-base">
              <p>
                <strong className="font-semibold text-lighttext">Veylora</strong> is a mathematical and
                technology-based project designed to study and optimize automobile fuel consumption. It models fuel
                consumption as a function of vehicle speed and applies differentiation to determine the speed
                corresponding to minimum fuel consumption.
              </p>
              <p>
                The central idea is to understand how changes in speed affect fuel usage. Using mathematical
                functions, graphs, first derivatives, and second derivatives, Veylora identifies critical points and
                determines whether they represent minimum or maximum fuel-consumption values.
              </p>
              <p>
                The model can be extended by considering vehicle weight, vehicle age, fuel type, engine
                characteristics, road conditions, road gradient, traffic, weather, air-conditioning usage,
                maintenance condition, acceleration, braking, idling, and driving behaviour.
              </p>
              <p>
                In future versions, these factors may be combined with multivariable calculus, numerical methods,
                data analysis, and optimization techniques to create a more personalized fuel-consumption
                prediction system.
              </p>
              <p>
                The project combines{' '}
                <strong className="font-semibold text-lighttext">
                  mathematics, automobile engineering, data analysis, and software development
                </strong>{' '}
                to investigate how fuel efficiency can be improved through scientific modelling rather than
                guesswork.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-3xl border border-lightborder bg-white p-6 shadow-card md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-lightmuted">The model</h3>
              <div className="mt-5 space-y-4">
                {MODEL.map((item) =>
                <div key={item.formula} className="rounded-2xl border border-lightborder bg-soft/60 p-4">
                    <p className="text-xs font-medium text-lightmuted">{item.label}</p>
                    <p className="mt-2 font-mono text-base text-lighttext md:text-lg">{item.formula}</p>
                  </div>
                )}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-lightmuted">
                Because <span className="font-mono">a &gt; 0</span>, the second derivative{' '}
                <span className="font-mono">F&#8243;(v) = 2a</span> is positive, so the critical point is a
                minimum &mdash; the estimated most-efficient speed.
              </p>

              <div className="mt-8 rounded-2xl border border-lightborder bg-white p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-lightmuted">Project Vision</h3>
                <p className="mt-3 text-sm leading-relaxed text-lightmuted">
                  The vision of Veylora is to develop a lightweight and intelligent system that helps users
                  understand fuel consumption, identify efficient driving conditions, compare different situations,
                  and make data-supported decisions for reducing fuel usage and operating costs.
                </p>
                <p className="mt-4 text-sm font-semibold text-accent">
                  Veylora &mdash; Find your most efficient drive.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>);

}
