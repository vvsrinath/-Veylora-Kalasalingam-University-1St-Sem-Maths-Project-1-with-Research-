import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

const PAGES = [
{ to: '/features', title: 'Features', description: 'Vehicle profiles, GPS trip tracking, fuel and cost analysis, and more.' },
{ to: '/how-it-works', title: 'How It Works', description: 'Four simple steps from adding your vehicle to driving smarter.' },
{ to: '/research', title: 'Research', description: 'The model, the visualization, the methodology, and the full research document.' },
{ to: '/developer', title: 'Developer', description: 'About the creator and developer behind Veylora.' },
{ to: '/about', title: 'About Veylora', description: 'The mathematical idea behind the project and its vision.' },
{ to: '/download', title: 'Download', description: 'Install Veylora on your device — no app store required.' }];


export function ExploreSection() {
  return (
    <section id="explore" className="bg-navydark py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-soft md:text-4xl">Explore Veylora</h2>
          <p className="mt-3 text-base text-muted md:text-lg">
            Everything about the project, on its own page.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAGES.map((page, i) =>
          <FadeIn key={page.to} delay={i % 3 * 0.06}>
              <Link
                to={page.to}
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-150 hover:border-accent/40">
                
                <div>
                  <h3 className="text-base font-semibold text-soft group-hover:text-accent">{page.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{page.description}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  View
                  <ArrowRightIcon size={16} />
                </span>
              </Link>
            </FadeIn>
          )}
        </div>
      </div>
    </section>);

}
