export interface CountryStatus {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  inrRate: number;
  petrolPerL: number;
  dieselPerL: number;
  cngPerKg: number;
  emissionNorm: string;
  region: string;
}

export const INDIAN_RUPEE_PER_USD = 84;

const USD_TO_INR = INDIAN_RUPEE_PER_USD;

function usd(inrPrice: number): number {
  return Number((inrPrice / USD_TO_INR).toFixed(2));
}

export const countries: CountryStatus[] = [
  {
    code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', inrRate: 1,
    petrolPerL: 101.8, dieselPerL: 91.2, cngPerKg: 75.6, emissionNorm: 'BS6', region: 'Asia'
  },
  {
    code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', inrRate: USD_TO_INR,
    petrolPerL: usd(72), dieselPerL: usd(84), cngPerKg: usd(55), emissionNorm: 'Federal Tier 3', region: 'North America'
  },
  {
    code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', inrRate: 105,
    petrolPerL: 126, dieselPerL: 130, cngPerKg: 95, emissionNorm: 'Euro 6', region: 'Europe'
  },
  {
    code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', inrRate: 91,
    petrolPerL: 118, dieselPerL: 104, cngPerKg: 85, emissionNorm: 'Euro 6', region: 'Europe'
  },
  {
    code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', inrRate: 91,
    petrolPerL: 126, dieselPerL: 105, cngPerKg: 88, emissionNorm: 'Euro 6', region: 'Europe'
  },
  {
    code: 'AE', name: 'UAE', currency: 'AED', currencySymbol: 'د.إ', inrRate: 23,
    petrolPerL: 34, dieselPerL: 32, cngPerKg: 25, emissionNorm: 'GCC', region: 'Middle East'
  },
  {
    code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: '﷼', inrRate: 22,
    petrolPerL: 31, dieselPerL: 28, cngPerKg: 22, emissionNorm: 'GCC', region: 'Middle East'
  },
  {
    code: 'CN', name: 'China', currency: 'CNY', currencySymbol: '¥', inrRate: 12,
    petrolPerL: 88, dieselPerL: 80, cngPerKg: 50, emissionNorm: 'China 6', region: 'Asia'
  },
  {
    code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', inrRate: 0.56,
    petrolPerL: 112, dieselPerL: 95, cngPerKg: 80, emissionNorm: 'WLTN', region: 'Asia'
  },
  {
    code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', inrRate: 55,
    petrolPerL: 82, dieselPerL: 88, cngPerKg: 60, emissionNorm: 'Euro 6', region: 'Oceania'
  },
  {
    code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', inrRate: 0.052,
    petrolPerL: 46, dieselPerL: 78, cngPerKg: 40, emissionNorm: 'AfCAP', region: 'Africa'
  },
  {
    code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', inrRate: 4.6,
    petrolPerL: 73, dieselPerL: 78, cngPerKg: 55, emissionNorm: 'Euro 5', region: 'Africa'
  },
  {
    code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', inrRate: 15,
    petrolPerL: 75, dieselPerL: 71, cngPerKg: 50, emissionNorm: 'Proconve L7', region: 'South America'
  },
  {
    code: 'MX', name: 'Mexico', currency: 'MXN', currencySymbol: 'Mex$', inrRate: 4.2,
    petrolPerL: 91, dieselPerL: 93, cngPerKg: 60, emissionNorm: 'EPA', region: 'North America'
  }
];

export function countryByCode(code: string): CountryStatus | undefined {
  return countries.find((c) => c.code === code);
}

export function tripCostInCountry(fuelUsedL: number, country: CountryStatus): number {
  return fuelUsedL * country.petrolPerL;
}

export function costInInr(amount: number, country: CountryStatus): number {
  return amount * country.inrRate;
}