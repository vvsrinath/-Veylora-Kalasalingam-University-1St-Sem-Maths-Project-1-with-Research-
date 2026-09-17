import React from 'react';
import { Link } from 'react-router-dom';
import { CarIcon, ClockIcon, SettingsIcon, InfoIcon, ChevronRightIcon, WifiOffIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Logo } from '../components/Logo';
import { useAppData } from '../contexts/AppDataContext';

const MENU_ITEMS = [
{ label: 'My Vehicles', to: '/my-vehicles', icon: CarIcon },
{ label: 'Trip History', to: '/trip/history', icon: ClockIcon },
{ label: 'Settings', to: '/settings', icon: SettingsIcon }];


export function Profile() {
  const { settings, updateSettings } = useAppData();

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-6 py-10 text-center md:py-14">
        <div className="flex justify-center">
          <Logo size={34} theme="dark" />
        </div>
        <p className="mt-2 text-sm text-muted">Find your most efficient drive.</p>

        <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-surface/60 p-4 text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <WifiOffIcon size={17} />
            </span>
            <div>
              <p className="text-sm font-medium text-soft">Offline Mode</p>
              <p className="text-xs text-muted">All core features available</p>
            </div>
          </div>
          <Toggle checked={settings.offlineMode} onChange={(v) => updateSettings({ offlineMode: v })} />
        </div>

        <ul className="mt-4 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-surface/60 text-left">
          {MENU_ITEMS.map((item) =>
          <li key={item.to}>
              <Link to={item.to} className="flex items-center justify-between px-4 py-3.5 transition-colors duration-150 hover:bg-white/5">
                <span className="flex items-center gap-3 text-sm font-medium text-soft">
                  <item.icon size={17} className="text-muted" />
                  {item.label}
                </span>
                <ChevronRightIcon size={16} className="text-muted" />
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/about"
              className="flex items-center justify-between px-4 py-3.5 transition-colors duration-150 hover:bg-white/5">
              
              <span className="flex items-center gap-3 text-sm font-medium text-soft">
                <InfoIcon size={17} className="text-muted" />
                About
              </span>
              <ChevronRightIcon size={16} className="text-muted" />
            </Link>
          </li>
        </ul>

        <p id="about" className="mt-6 text-xs leading-relaxed text-muted">
          Veylora v1.0 · A personal fuel-efficiency companion. Estimates are based on a simplified model and your
          own trip data — always follow legal speed limits and road safety rules.
        </p>
      </div>
    </AppShell>);

}

function Toggle({ checked, onChange }: {checked: boolean;onChange: (value: boolean) => void;}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-out ${
      checked ? 'bg-accent' : 'bg-white/15'}`
      }>
      
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-150 ease-out ${
        checked ? 'translate-x-5' : 'translate-x-0.5'}`
        } />
      
    </button>);

}