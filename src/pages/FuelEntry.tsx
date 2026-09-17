import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InfoIcon, ArrowRightIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { useAppData } from '../contexts/AppDataContext';
import { createId } from '../utils/id';
import { Trip } from '../types/trip';
import {
  computeFuelUsed,
  computeMileage,
  computeConsumption100,
  computeFuelCost,
  computeCostPerKm,
  estimateCO2SavedKg,
  assessDataQuality,
  getConsumptionModel } from
'../utils/fuelMath';
import { generateRecommendations } from '../utils/recommendations';
import { LiveTripResult } from '../hooks/useLiveTrip';

const inputClass =
'w-full rounded-xl border border-lightborder bg-white px-3.5 py-2.5 text-sm text-lighttext placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';

export function FuelEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeVehicle, addTrip } = useAppData();
  const tripDraft = location.state as LiveTripResult | null || null;

  const [distanceKm, setDistanceKm] = useState(tripDraft ? tripDraft.distanceKm.toFixed(1) : '');
  const [durationMin, setDurationMin] = useState(tripDraft ? Math.round(tripDraft.durationSec / 60).toString() : '');
  const [avgSpeed, setAvgSpeed] = useState(tripDraft ? Math.round(tripDraft.avgSpeedKmh).toString() : '');
  const [maxSpeed, setMaxSpeed] = useState(tripDraft ? Math.round(tripDraft.maxSpeedKmh).toString() : '');
  const [fuelBefore, setFuelBefore] = useState('');
  const [fuelAfter, setFuelAfter] = useState('');
  const [fuelRefilled, setFuelRefilled] = useState('');
  const [pricePerL, setPricePerL] = useState('101.8');
  const [dashboardMileage, setDashboardMileage] = useState('');
  const [fuelEstimated, setFuelEstimated] = useState(false);

  const canSubmit = distanceKm && durationMin && avgSpeed && fuelBefore && fuelAfter;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const distance = Number(distanceKm);
    const durationSec = Number(durationMin) * 60;
    const fuelUsedL = computeFuelUsed(Number(fuelBefore), Number(fuelAfter), Number(fuelRefilled) || 0);
    const mileageKmL = computeMileage(distance, fuelUsedL) ?? undefined;
    const consumptionL100km = computeConsumption100(fuelUsedL, distance) ?? undefined;
    const fuelCost = computeFuelCost(fuelUsedL, Number(pricePerL) || 0);
    const costPerKm = computeCostPerKm(fuelCost, distance) ?? undefined;
    const co2SavedKg = estimateCO2SavedKg(distance, fuelUsedL, activeVehicle.manufacturerMileage, activeVehicle.fuelType);
    const quality = assessDataQuality({
      durationSec,
      hasFuelData: true,
      fuelEstimated,
      maintenanceDataComplete: Boolean(activeVehicle.tyrePressureCondition && activeVehicle.engineCondition)
    });
    const model = getConsumptionModel(activeVehicle);

    const trip: Trip = {
      id: createId('trip'),
      vehicleId: activeVehicle.id,
      date: new Date().toISOString(),
      distanceKm: distance,
      durationSec,
      avgSpeedKmh: Number(avgSpeed),
      maxSpeedKmh: Number(maxSpeed) || Number(avgSpeed),
      speedSamples: tripDraft?.speedSamples || [],
      fuelBeforeL: Number(fuelBefore),
      fuelAfterL: Number(fuelAfter),
      fuelRefilledL: Number(fuelRefilled) || undefined,
      fuelPricePerL: Number(pricePerL) || undefined,
      fuelUsedL,
      mileageKmL,
      consumptionL100km,
      fuelCost,
      costPerKm,
      co2SavedKg,
      dataQuality: quality.quality,
      dataQualityReasons: quality.reasons,
      source: fuelEstimated ? 'estimated' : 'measured',
      optimalSpeedAtTripKmh: model.optimalSpeedKmh
    };

    trip.recommendations = generateRecommendations(trip, activeVehicle, model.optimalSpeedKmh);

    addTrip(trip);
    navigate(`/trip/report/${trip.id}`);
  }

  return (
    <AppShell background="bg-soft">
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg px-6 py-8 md:py-12">
        <h1 className="text-xl font-bold text-lighttext">Fuel Entry</h1>
        <p className="mt-1 text-sm text-lightmuted">{activeVehicle.name}</p>

        <div className="mt-5 flex gap-2.5 rounded-xl bg-accent/10 p-3.5 text-xs leading-relaxed text-lighttext">
          <InfoIcon size={16} className="mt-0.5 shrink-0 text-accent" />
          <p>GPS can measure speed and distance, but actual fuel consumption requires fuel-use information from you or your vehicle.</p>
        </div>

        {!tripDraft &&
        <div className="mt-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-lightmuted">Trip details</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Distance travelled (km)" required>
                <input type="number" min={0} value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Duration (minutes)" required>
                <input type="number" min={0} value={durationMin} onChange={(e) => setDurationMin(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Average speed (km/h)" required>
                <input type="number" min={0} value={avgSpeed} onChange={(e) => setAvgSpeed(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Max speed (km/h)">
                <input type="number" min={0} value={maxSpeed} onChange={(e) => setMaxSpeed(e.target.value)} className={inputClass} />
              </Field>
            </div>
          </div>
        }

        <div className="mt-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-lightmuted">Fuel details</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fuel level before (L)" required>
              <input type="number" min={0} value={fuelBefore} onChange={(e) => setFuelBefore(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Fuel level after (L)" required>
              <input type="number" min={0} value={fuelAfter} onChange={(e) => setFuelAfter(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fuel refilled (L)">
              <input type="number" min={0} value={fuelRefilled} onChange={(e) => setFuelRefilled(e.target.value)} placeholder="Optional" className={inputClass} />
            </Field>
            <Field label="Price per litre (₹)">
              <input type="number" min={0} value={pricePerL} onChange={(e) => setPricePerL(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Dashboard mileage reading (km/L)">
            <input
              type="number"
              min={0}
              value={dashboardMileage}
              onChange={(e) => setDashboardMileage(e.target.value)}
              placeholder="Optional"
              className={inputClass} />
            
          </Field>

          <label className="flex items-center gap-2.5 text-sm text-lighttext">
            <input
              type="checkbox"
              checked={fuelEstimated}
              onChange={(e) => setFuelEstimated(e.target.checked)}
              className="h-4 w-4 rounded border-lightborder text-accent focus:ring-accent" />
            
            Fuel levels above are estimated, not measured precisely
          </label>
        </div>

        <Button type="submit" size="lg" className="mt-8 w-full" disabled={!canSubmit}>
          Calculate & Save Trip
          <ArrowRightIcon size={18} />
        </Button>
      </form>
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