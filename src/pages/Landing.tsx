import React from 'react';
import { SiteLayout } from '../components/landing/SiteLayout';
import { Hero } from '../components/landing/Hero';
import { ValueSection } from '../components/landing/ValueSection';
import { ExploreSection } from '../components/landing/ExploreSection';

export function Landing() {
  return (
    <SiteLayout>
      <Hero />
      <ValueSection />
      <ExploreSection />
    </SiteLayout>);

}
