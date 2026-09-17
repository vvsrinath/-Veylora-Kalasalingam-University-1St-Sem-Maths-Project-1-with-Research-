import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, NavigationIcon, BarChart3Icon, UserRoundIcon } from 'lucide-react';

const NAV_ITEMS = [
{ label: 'Home', to: '/dashboard', icon: HomeIcon },
{ label: 'Trip', to: '/trip/start', icon: NavigationIcon },
{ label: 'Reports', to: '/trip/history', icon: BarChart3Icon },
{ label: 'Profile', to: '/profile', icon: UserRoundIcon }];


export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-navy/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const active =
          location.pathname === item.to ||
          item.to === '/trip/start' && location.pathname.startsWith('/trip') && location.pathname !== '/trip/history';
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium">
                
                <Icon
                  size={22}
                  strokeWidth={2}
                  className={active ? 'text-accent' : 'text-muted'}
                  aria-hidden="true" />
                
                <span className={active ? 'text-accent' : 'text-muted'}>{item.label}</span>
              </Link>
            </li>);

        })}
      </ul>
    </nav>);

}