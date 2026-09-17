import React from 'react';
import { LandingNav } from './LandingNav';
import { SiteFooter } from './SiteFooter';

export function SiteLayout({ children }: {children: React.ReactNode;}) {
  return (
    <div className="flex min-h-full w-full flex-col bg-navy">
      <LandingNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>);

}
