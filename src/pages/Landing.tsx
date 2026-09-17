import React from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { Hero } from '../components/landing/Hero';
import { ValueSection } from '../components/landing/ValueSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureShowcase } from '../components/landing/FeatureShowcase';
import { DeveloperSection } from '../components/landing/DeveloperSection';
import { AboutSection } from '../components/landing/AboutSection';
import { InstallAndFooter } from '../components/landing/InstallAndFooter';

export function Landing() {
  return (
    <div className="w-full min-h-full bg-navy">
      <LandingNav />
      <Hero />
      <ValueSection />
      <HowItWorks />
      <FeatureShowcase />
      <DeveloperSection />
      <AboutSection />
      <InstallAndFooter />
    </div>);

}