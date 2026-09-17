import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';

export function SiteFooter() {
  return (
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
              Created &amp; developed by <span className="font-medium text-soft">Srinath Vatchavari Venkateshan</span>.
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
    </footer>);

}
