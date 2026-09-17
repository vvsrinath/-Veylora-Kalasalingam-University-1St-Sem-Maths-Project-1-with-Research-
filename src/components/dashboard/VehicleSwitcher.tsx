import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, PlusIcon, CarIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { FUEL_TYPE_LABELS } from '../../types/vehicle';

export function VehicleSwitcher() {
  const { vehicles, activeVehicle, setActiveVehicleId } = useAppData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!activeVehicle) return null;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-sm font-medium text-soft transition-colors duration-150 hover:bg-white/10">
        
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <CarIcon size={15} aria-hidden="true" />
        </span>
        <span className="min-w-0 truncate">
          {activeVehicle.name} · {FUEL_TYPE_LABELS[activeVehicle.fuelType]}
        </span>
        <ChevronDownIcon size={15} className="shrink-0 text-muted" aria-hidden="true" />
      </button>

      {open &&
      <div
        role="listbox"
        className="absolute left-0 z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-navydark shadow-glow">
        
          {vehicles.map((v) =>
        <button
          key={v.id}
          role="option"
          aria-selected={v.id === activeVehicle.id}
          onClick={() => {
            setActiveVehicleId(v.id);
            setOpen(false);
          }}
          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-white/5 ${
          v.id === activeVehicle.id ? 'text-accent' : 'text-soft'}`
          }>
          
              <span>
                {v.name}
                <span className="block text-xs text-muted">{FUEL_TYPE_LABELS[v.fuelType]}</span>
              </span>
              {v.id === activeVehicle.id && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </button>
        )}
          <Link
          to="/vehicle-setup"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-sm font-medium text-accent hover:bg-white/5">
          
            <PlusIcon size={15} />
            Add vehicle
          </Link>
        </div>
      }
    </div>);

}