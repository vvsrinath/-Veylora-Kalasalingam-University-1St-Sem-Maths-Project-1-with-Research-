import React from 'react';
import { featureShowcase } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

export function FeatureShowcase() {
  return (
    <section id="features" className="bg-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-lighttext md:text-4xl">Built for real driving</h2>
          <p className="mt-3 text-base text-lightmuted md:text-lg">
            One place for your vehicle, your trips, and the context behind every litre of fuel.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureShowcase.map((feature, i) =>
          <FadeIn key={feature.title} delay={i % 3 * 0.06}>
              <div className="flex h-full gap-4 rounded-2xl border border-lightborder bg-white p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <feature.icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-lighttext">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-lightmuted">{feature.description}</p>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>);

}