import React from 'react';
import { valueCards } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

export function ValueSection() {
  return (
    <section className="bg-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-lighttext md:text-4xl">
            Everything you need for a better drive
          </h2>
          <p className="mt-3 text-base text-lightmuted md:text-lg">
            Simple tools. Real insights. A more efficient drive.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((card, i) =>
          <FadeIn key={card.title} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-lightborder bg-white p-6 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <card.icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-lighttext">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-lightmuted">{card.description}</p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>);

}