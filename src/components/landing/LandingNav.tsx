import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';
import { InstallButton } from '../InstallButton';

const LINKS = [
{ label: 'Home', to: '/' },
{ label: 'Features', to: '/features' },
{ label: 'How It Works', to: '/how-it-works' },
{ label: 'Developer', to: '/developer' },
{ label: 'About', to: '/about' },
{ label: 'Research', to: '/research' },
{ label: 'Download', to: '/download' }];


export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center" aria-label="Veylora home">
          <Logo size={26} theme="dark" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Site">
          {LINKS.map((link) =>
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
            isActive ? 'bg-white/5 text-soft' : 'text-muted hover:bg-white/5 hover:text-soft'}`
            }>
            
              {link.label}
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <InstallButton label="Install app" variant="outline" theme="dark" size="sm" />
          <Link to="/dashboard">
            <Button size="sm">Get Veylora</Button>
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-soft md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}>
          
          {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {open &&
      <div className="border-t border-white/10 bg-navy px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Site">
            {LINKS.map((link) =>
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
            `rounded-lg px-3 py-2.5 text-sm font-medium ${
            isActive ? 'bg-white/5 text-soft' : 'text-soft hover:bg-white/5'}`
            }>
            
                {link.label}
              </NavLink>
          )}
          </nav>
          <Link to="/dashboard" className="mt-3 block" onClick={() => setOpen(false)}>
            <Button className="w-full">Get Veylora</Button>
          </Link>
          <div className="mt-2">
            <InstallButton label="Install app" variant="outline" theme="dark" className="w-full" />
          </div>
        </div>
      }
    </header>);

}
