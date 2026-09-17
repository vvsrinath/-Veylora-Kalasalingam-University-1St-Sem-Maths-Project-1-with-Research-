import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, CarIcon, CheckIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppData } from '../contexts/AppDataContext';
import { FUEL_TYPE_LABELS, VEHICLE_TYPE_LABELS, CONDITION_LABELS } from '../types/vehicle';
import { getConsumptionModel } from '../utils/fuelMath';

export function MyVehicles() {
  const { vehicles, activeVehicle, setActiveVehicleId } = useAppData();

  return (
    <AppShell background="bg-soft">
      <div className="mx-auto max-w-3xl px-6 py-8 md:py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-lighttext">My Vehicles</h1>
          <Link to="/vehicle-setup">
            <Button size="sm" theme="light">
              <PlusIcon size={16} />
              Add Vehicle
            </Button>
          </Link>
        </div>

        <ul className="mt-6 space-y-3">
          {vehicles.map((vehicle) => {
            const isActive = vehicle.id === activeVehicle?.id;
            const model = getConsumptionModel(vehicle);
            return (
              <li
                key={vehicle.id}
                className={`rounded-2xl border bg-white p-5 ${isActive ? 'border-accent' : 'border-lightborder'}`}>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <CarIcon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-lighttext">{vehicle.name}</p>
                      <p className="mt-0.5 text-xs text-lightmuted">
                        {VEHICLE_TYPE_LABELS[vehicle.type]} · {FUEL_TYPE_LABELS[vehicle.fuelType]} ·{' '}
                        {CONDITION_LABELS[vehicle.condition]}
                      </p>
                    </div>
                  </div>
                  {isActive ?
                  <Badge theme="light" tone="success" icon={<CheckIcon size={13} />}>
                      Active
                    </Badge> :

                  <Button size="sm" variant="outline" theme="light" onClick={() => setActiveVehicleId(vehicle.id)}>
                      Set active
                    </Button>
                  }
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-lightborder pt-4 text-center">
                  <div>
                    <p className="text-sm font-semibold text-lighttext">{vehicle.odometerKm.toLocaleString()}</p>
                    <p className="text-[11px] text-lightmuted">Odometer km</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-lighttext">{vehicle.manufacturerMileage} km/L</p>
                    <p className="text-[11px] text-lightmuted">Rated mileage</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-lighttext">{model.optimalSpeedKmh} km/h</p>
                    <p className="text-[11px] text-lightmuted">Optimal speed</p>
                  </div>
                </div>
              </li>);

          })}
        </ul>
      </div>
    </AppShell>);

}