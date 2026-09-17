import React from 'react';
import { ShareIcon, PlusSquareIcon, SmartphoneIcon, WifiOffIcon } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

const INSTALL_STEPS = [
{ icon: ShareIcon, text: 'Open Veylora in your browser and tap Share (or the menu icon).' },
{ icon: PlusSquareIcon, text: 'Choose "Add to Home Screen".' },
{ icon: SmartphoneIcon, text: 'Launch Veylora like any other app — no app store required.' }];


export function DownloadSection() {
  return (
    <section id="download" className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-navydark/60 p-8 md:grid-cols-2 md:p-12">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted">
              <WifiOffIcon size={14} className="text-accent" />
              Works offline
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-soft md:text-4xl">
              Lightweight. No app store required.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
              Veylora runs in your browser and works from your home screen. Vehicle profiles, trip logging, the
              fuel calculator, and your reports stay available even without a connection.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ol className="space-y-4">
              {INSTALL_STEPS.map((step, i) =>
              <li key={step.text} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-accent">
                    <step.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    <span className="font-medium text-soft">Step {i + 1}. </span>
                    {step.text}
                  </p>
                </li>
              )}
            </ol>
          </FadeIn>
        </div>
      </div>
    </section>);

}
