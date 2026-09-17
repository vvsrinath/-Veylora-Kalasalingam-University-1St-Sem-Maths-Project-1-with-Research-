import React from 'react';
import { howItWorksSteps } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-navydark py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-soft md:text-4xl">How Veylora works</h2>
          <p className="mt-3 text-base text-muted md:text-lg">
            Four simple steps from adding your vehicle to driving smarter.
          </p>
        </FadeIn>

        <div className="relative mt-16">
          <div className="hidden md:block absolute left-0 right-0 top-6 h-px bg-white/10" aria-hidden="true" />
          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {howItWorksSteps.map((step, i) =>
            <FadeIn key={step.number} delay={i * 0.08}>
                <li className="relative flex gap-4 md:flex-col md:gap-0">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navydark ring-1 ring-white/10">
                    <span className="text-sm font-bold text-accent">{step.number}</span>
                  </div>
                  <div className="md:mt-5">
                    <step.icon size={20} className="hidden text-accent2 md:block" strokeWidth={1.75} aria-hidden="true" />
                    <h3 className="mt-0 text-base font-semibold text-soft md:mt-3">{step.title}</h3>
                    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">{step.description}</p>
                  </div>
                </li>
              </FadeIn>
            )}
          </ol>
        </div>
      </div>
    </section>);

}