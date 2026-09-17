import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';
import { InstallButton } from '../InstallButton';

const LINKS = [
{ label: 'Home', href: '#top' },
{ label: 'Features', href: '#features' },
{ label: 'How It Works', href: '#how-it-works' },
{ label: 'Developer', href: '#developer' },
{ label: 'About', href: '#about' },
{ label: 'Research', href: '#research' },
{ label: 'Download', href: '#download' }];


export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center" aria-label="Veylora home">
          <Logo size={26} theme="dark" />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Site">
          {LINKS.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors duration-150 ease-out hover:bg-white/5 hover:text-soft">
            
              {link.label}
            </a>
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
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-soft hover:bg-white/5">
            
                {link.label}
              </a>
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