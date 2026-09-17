import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../Logo';
import { InstallButton } from '../InstallButton';

const NAV_ITEMS = [
{ label: 'Dashboard', to: '/dashboard' },
{ label: 'My Vehicle', to: '/my-vehicles' },
{ label: 'Start Trip', to: '/trip/start' },
{ label: 'Trip History', to: '/trip/history' },
{ label: 'Optimization', to: '/optimization' },
{ label: 'Settings', to: '/settings' }];


export function TopNav() {
  const location = useLocation();

  return (
    <header className="hidden md:flex sticky top-0 z-30 h-16 items-center justify-between border-b border-white/10 bg-navy/90 px-8 backdrop-blur">
      <Link to="/dashboard" className="flex items-center" aria-label="Veylora home">
        <Logo size={26} theme="dark" />
      </Link>
      <nav className="flex items-center gap-1" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
              active ? 'bg-accent/15 text-accent' : 'text-muted hover:text-soft hover:bg-white/5'}`
              }>
              
              {item.label}
            </Link>);

        })}
      </nav>
      <div className="flex items-center">
        <InstallButton label="Install app" variant="outline" size="sm" />
      </div>
    </header>);

}