import React from 'react';
import { Link } from 'react-router-dom';
import { ShareIcon, PlusSquareIcon, SmartphoneIcon, WifiOffIcon } from 'lucide-react';
import { Logo } from '../Logo';
import { FadeIn } from '../ui/FadeIn';

const INSTALL_STEPS = [
{ icon: ShareIcon, text: 'Open Veylora in your browser and tap Share (or the menu icon).' },
{ icon: PlusSquareIcon, text: 'Choose "Add to Home Screen".' },
{ icon: SmartphoneIcon, text: 'Launch Veylora like any other app — no app store required.' }];


export function InstallAndFooter() {
  return (
    <>
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
      </section>

      <footer className="border-t border-white/10 bg-navy py-14">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <Logo size={26} theme="dark" />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Veylora is a personal fuel-efficiency companion for cars, motorcycles, scooters, and
                three-wheelers. It turns your own vehicle and trip data into practical, understandable insights —
                using a simplified calculus-based model that improves as your data grows.
              </p>
              <p className="mt-4 text-xs text-muted">
                Created &amp; developed by <span className="font-medium text-soft">Srinath V.V</span>.
              </p>
              <div className="mt-3 flex flex-wrap gap-4">
                <a href="mailto:vvsrinath0@gmail.com" className="text-sm text-soft/90 hover:text-accent">
                  Email
                </a>
                <a href="https://github.com/vvsrinath" target="_blank" rel="noreferrer" className="text-sm text-soft/90 hover:text-accent">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/srinath-v-a26b372b7" target="_blank" rel="noreferrer" className="text-sm text-soft/90 hover:text-accent">
                  LinkedIn
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Explore</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link to="/dashboard" className="text-sm text-soft/90 hover:text-accent">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/optimization" className="text-sm text-soft/90 hover:text-accent">
                    Speed Optimization
                  </Link>
                </li>
                <li>
                  <Link to="/trip/history" className="text-sm text-soft/90 hover:text-accent">
                    Trip History
                  </Link>
                </li>
                <li>
                  <Link to="/my-vehicles" className="text-sm text-soft/90 hover:text-accent">
                    My Vehicles
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Veylora. Estimates only — not a guarantee of fuel savings.</p>
            <p>Always follow legal speed limits and road safety rules.</p>
          </div>
        </div>
      </footer>
    </>);

}