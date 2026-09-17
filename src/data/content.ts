import {
  GaugeIcon,
  MapPinIcon,
  FuelIcon,
  LightbulbIcon,
  CarIcon,
  NavigationIcon,
  CalculatorIcon,
  TrendingUpIcon,
  ClipboardListIcon,
  SatelliteDishIcon,
  WrenchIcon,
  MountainIcon,
  CloudSunIcon,
  ActivityIcon,
  WifiOffIcon,
  type LucideIcon } from
'lucide-react';

export interface ValueCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const valueCards: ValueCard[] = [
{
  icon: GaugeIcon,
  title: 'Optimal Speed',
  description: 'Find the estimated speed associated with lower fuel consumption for your vehicle.'
},
{
  icon: MapPinIcon,
  title: 'Live Trip Tracking',
  description: 'Record distance, speed, duration, and route information as you drive.'
},
{
  icon: FuelIcon,
  title: 'Fuel & Cost Analysis',
  description: 'Calculate mileage, fuel cost, and consumption from your own trip data.'
},
{
  icon: LightbulbIcon,
  title: 'Personalized Recommendations',
  description: 'Receive understandable, non-judgmental insights based on your own driving.'
}];


export interface HowItWorksStep {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
{
  number: 1,
  icon: CarIcon,
  title: 'Add Your Vehicle',
  description: 'Enter vehicle type, fuel type, tank capacity, mileage, age, and maintenance information.'
},
{
  number: 2,
  icon: NavigationIcon,
  title: 'Track Your Trip',
  description: 'Use GPS to record distance, speed, travel time, and route data.'
},
{
  number: 3,
  icon: CalculatorIcon,
  title: 'Calculate Consumption',
  description: 'Enter fuel used or fuel-level information so Veylora can calculate mileage.'
},
{
  number: 4,
  icon: TrendingUpIcon,
  title: 'Optimize Your Drive',
  description: 'Use the speed-consumption model to identify an estimated minimum-consumption speed.'
}];


export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const featureShowcase: FeatureItem[] = [
{
  icon: ClipboardListIcon,
  title: 'Vehicle Profile',
  description: 'Store vehicle information — type, fuel, mileage, and condition — in one place.'
},
{
  icon: SatelliteDishIcon,
  title: 'GPS Trip Tracking',
  description: 'Track speed, distance, duration, and route when location permission is available.'
},
{
  icon: CalculatorIcon,
  title: 'Fuel Calculator',
  description: 'Calculate km/L, L/100km, fuel used, fuel cost, and cost per kilometre.'
},
{
  icon: TrendingUpIcon,
  title: 'Calculus-Based Optimization',
  description: 'View the fuel-consumption curve and an estimated optimal speed.'
},
{
  icon: WrenchIcon,
  title: 'Maintenance Awareness',
  description: 'Record vehicle age, mileage, service history, tyre and maintenance condition.'
},
{
  icon: MountainIcon,
  title: 'Road and Terrain Context',
  description: 'Account for city roads, highways, hills, plains, slope, and traffic conditions.'
},
{
  icon: CloudSunIcon,
  title: 'Weather Context',
  description: 'Let temperature and weather information influence your estimates.'
},
{
  icon: ActivityIcon,
  title: 'Driver Behaviour',
  description: 'Understand average speed, sudden acceleration, harsh braking, and idling.'
},
{
  icon: WifiOffIcon,
  title: 'Offline Mode',
  description: 'View vehicles, record trips, and use the calculator without a connection.'
}];


export const heroHighlights = [
{ icon: GaugeIcon, label: 'Optimize Fuel Usage' },
{ icon: MapPinIcon, label: 'Track Your Trips' },
{ icon: FuelIcon, label: 'Save More Money' },
{ icon: LightbulbIcon, label: 'Drive with Insights' }];


export const trustHighlights = [
{ title: 'Personalized', description: 'Estimates based on your vehicle and trips, not generic averages.' },
{ title: 'Calculus-based', description: 'A transparent optimization model you can expand and inspect.' },
{ title: 'Offline-ready', description: 'Core features work without a constant connection.' },
{ title: 'No sign-up required', description: 'Start tracking trips on your device right away.' }];