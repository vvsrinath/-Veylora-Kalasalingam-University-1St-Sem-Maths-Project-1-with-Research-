import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CarIcon,
  BikeIcon,
  TruckIcon,
  MoreHorizontalIcon,
  FuelIcon,
  FlameIcon,
  DropletIcon,
  CircleDotIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InfoIcon } from
'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/vehicle/StepIndicator';
import { useAppData } from '../contexts/AppDataContext';
import { createId } from '../utils/id';
import {
  Vehicle,
  VehicleType,
  FuelType,
  MaintenanceCondition,
  PartCondition,
  VEHICLE_TYPE_LABELS,
  FUEL_TYPE_LABELS,
  CONDITION_LABELS } from
'../types/vehicle';

const TOTAL_STEPS = 4;

const inputClass =
'w-full rounded-xl border border-lightborder bg-white px-3.5 py-2.5 text-sm text-lighttext placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';

const VEHICLE_TYPES: {value: VehicleType;icon: typeof CarIcon;}[] = [
{ value: 'car', icon: CarIcon },
{ value: 'motorcycle', icon: BikeIcon },
{ value: 'scooter', icon: BikeIcon },
{ value: 'three-wheeler', icon: TruckIcon },
{ value: 'other', icon: MoreHorizontalIcon }];


const FUEL_TYPES: {value: FuelType;icon: typeof FuelIcon;}[] = [
{ value: 'petrol', icon: FuelIcon },
{ value: 'diesel', icon: FuelIcon },
{ value: 'cng', icon: FlameIcon },
{ value: 'ethanol-blend', icon: DropletIcon },
{ value: 'biodiesel-blend', icon: DropletIcon },
{ value: 'other-biofuel', icon: CircleDotIcon }];


const CONDITIONS: MaintenanceCondition[] = ['well-maintained', 'normally-maintained', 'maintenance-required'];

interface FormState {
  type: VehicleType;
  fuelType: FuelType;
  name: string;
  tankCapacityL: string;
  manufacturerMileage: string;
  userObservedMileage: string;
  ageYears: string;
  odometerKm: string;
  weightKg: string;
  condition: MaintenanceCondition;
  lastServiceDate: string;
  tyrePressureCondition: PartCondition | '';
  engineCondition: PartCondition | '';
  knownIssues: string;
}

const INITIAL_FORM: FormState = {
  type: 'car',
  fuelType: 'petrol',
  name: '',
  tankCapacityL: '',
  manufacturerMileage: '',
  userObservedMileage: '',
  ageYears: '',
  odometerKm: '',
  weightKg: '',
  condition: 'normally-maintained',
  lastServiceDate: '',
  tyrePressureCondition: '',
  engineCondition: '',
  knownIssues: ''
};

export function VehicleSetup() {
  const navigate = useNavigate();
  const { addVehicle } = useAppData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canProceed =
  step === 1 ||
  step === 2 ||
  step === 3 &&
  Boolean(form.name.trim() && form.tankCapacityL && form.manufacturerMileage && form.ageYears && form.odometerKm) ||
  step === 4;

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      const vehicle: Vehicle = {
        id: createId('veh'),
        name: form.name.trim() || VEHICLE_TYPE_LABELS[form.type],
        type: form.type,
        fuelType: form.fuelType,
        tankCapacityL: Number(form.tankCapacityL) || 0,
        manufacturerMileage: Number(form.manufacturerMileage) || 0,
        userObservedMileage: form.userObservedMileage ? Number(form.userObservedMileage) : undefined,
        ageYears: Number(form.ageYears) || 0,
        odometerKm: Number(form.odometerKm) || 0,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        condition: form.condition,
        lastServiceDate: form.lastServiceDate || undefined,
        tyrePressureCondition: form.tyrePressureCondition || undefined,
        engineCondition: form.engineCondition || undefined,
        knownIssues: form.knownIssues || undefined
      };
      addVehicle(vehicle);
      navigate('/dashboard');
    }
  }

  const stepLabels = ['Vehicle Type', 'Fuel Type', 'Vehicle Details', 'Vehicle Condition'];

  return (
    <AppShell background="bg-soft">
      <div className="mx-auto max-w-xl px-6 py-8 md:py-12">
        <h1 className="text-xl font-bold text-lighttext">Vehicle Setup</h1>
        <div className="mt-5">
          <StepIndicator step={step} totalSteps={TOTAL_STEPS} label={stepLabels[step - 1]} />
        </div>

        <div className="mt-8">
          {step === 1 &&
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {VEHICLE_TYPES.map(({ value, icon: Icon }) =>
            <OptionCard
              key={value}
              selected={form.type === value}
              onClick={() => update('type', value)}
              icon={<Icon size={22} strokeWidth={1.75} />}
              label={VEHICLE_TYPE_LABELS[value]} />

            )}
            </div>
          }

          {step === 2 &&
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FUEL_TYPES.map(({ value, icon: Icon }) =>
            <OptionCard
              key={value}
              selected={form.fuelType === value}
              onClick={() => update('fuelType', value)}
              icon={<Icon size={22} strokeWidth={1.75} />}
              label={FUEL_TYPE_LABELS[value]} />

            )}
            </div>
          }

          {step === 3 &&
          <div className="space-y-4">
              <Field label="Vehicle name or model" required>
                <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Honda City"
                className={inputClass} />
              
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tank capacity (L)" required>
                  <input
                  type="number"
                  min={0}
                  value={form.tankCapacityL}
                  onChange={(e) => update('tankCapacityL', e.target.value)}
                  placeholder="40"
                  className={inputClass} />
                
                </Field>
                <Field label="Manufacturer mileage (km/L)" required>
                  <input
                  type="number"
                  min={0}
                  value={form.manufacturerMileage}
                  onChange={(e) => update('manufacturerMileage', e.target.value)}
                  placeholder="18"
                  className={inputClass} />
                
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Your observed mileage (km/L)">
                  <input
                  type="number"
                  min={0}
                  value={form.userObservedMileage}
                  onChange={(e) => update('userObservedMileage', e.target.value)}
                  placeholder="Optional"
                  className={inputClass} />
                
                </Field>
                <Field label="Vehicle age (years)" required>
                  <input
                  type="number"
                  min={0}
                  value={form.ageYears}
                  onChange={(e) => update('ageYears', e.target.value)}
                  placeholder="3"
                  className={inputClass} />
                
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Current odometer (km)" required>
                  <input
                  type="number"
                  min={0}
                  value={form.odometerKm}
                  onChange={(e) => update('odometerKm', e.target.value)}
                  placeholder="32450"
                  className={inputClass} />
                
                </Field>
                <Field label="Approx. weight (kg)">
                  <input
                  type="number"
                  min={0}
                  value={form.weightKg}
                  onChange={(e) => update('weightKg', e.target.value)}
                  placeholder="Optional"
                  className={inputClass} />
                
                </Field>
              </div>
            </div>
          }

          {step === 4 &&
          <div className="space-y-6">
              <div className="grid gap-3">
                {CONDITIONS.map((c) =>
              <button
                key={c}
                type="button"
                onClick={() => update('condition', c)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-colors duration-150 ${
                form.condition === c ?
                'border-accent bg-accent/10 text-lighttext' :
                'border-lightborder bg-white text-lighttext hover:bg-black/[0.02]'}`
                }>
                
                    {CONDITION_LABELS[c]}
                    {form.condition === c && <CheckIcon size={16} className="text-accent" />}
                  </button>
              )}
              </div>

              <div className="space-y-4">
                <Field label="Last service date">
                  <input
                  type="date"
                  value={form.lastServiceDate}
                  onChange={(e) => update('lastServiceDate', e.target.value)}
                  className={inputClass} />
                
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tyre-pressure condition">
                    <select
                    value={form.tyrePressureCondition}
                    onChange={(e) => update('tyrePressureCondition', e.target.value as PartCondition | '')}
                    className={inputClass}>
                    
                      <option value="">Not sure</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </Field>
                  <Field label="Engine condition">
                    <select
                    value={form.engineCondition}
                    onChange={(e) => update('engineCondition', e.target.value as PartCondition | '')}
                    className={inputClass}>
                    
                      <option value="">Not sure</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </Field>
                </div>
                <Field label="Known issues">
                  <textarea
                  value={form.knownIssues}
                  onChange={(e) => update('knownIssues', e.target.value)}
                  placeholder="Optional"
                  rows={2}
                  className={`${inputClass} resize-none`} />
                
                </Field>
              </div>

              <div className="flex gap-2.5 rounded-xl bg-accent/10 p-3.5 text-xs leading-relaxed text-lighttext">
                <InfoIcon size={16} className="mt-0.5 shrink-0 text-accent" />
                <p>
                  Maintenance-based results are estimates. They become more accurate with real diagnostic or
                  service data over time.
                </p>
              </div>
            </div>
          }
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" theme="light" onClick={() => step === 1 ? navigate(-1) : setStep((s) => s - 1)}>
            <ArrowLeftIcon size={16} />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed}>
            {step === TOTAL_STEPS ? 'Save Vehicle' : 'Next'}
            {step < TOTAL_STEPS && <ArrowRightIcon size={16} />}
          </Button>
        </div>
      </div>
    </AppShell>);

}

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required, children }: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-lightmuted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>);

}

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function OptionCard({ selected, onClick, icon, label }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-sm font-medium transition-colors duration-150 ${
      selected ?
      'border-accent bg-accent/10 text-lighttext' :
      'border-lightborder bg-white text-lighttext hover:bg-black/[0.02]'}`
      }>
      
      <span className={selected ? 'text-accent' : 'text-lightmuted'}>{icon}</span>
      {label}
    </button>);

}