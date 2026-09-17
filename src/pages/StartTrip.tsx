import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayIcon, PauseIcon, SquareIcon, ShieldAlertIcon, WifiIcon, WifiOffIcon, MapPinIcon, ThermometerIcon, CloudFogIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SpeedGauge } from '../components/trip/SpeedGauge';
import { RoutePath } from '../components/trip/RoutePath';
import { useLiveTrip } from '../hooks/useLiveTrip';
import { useAppData } from '../contexts/AppDataContext';
import { aqiLabel } from '../utils/environmentApi';
import { formatDuration, formatDistance, formatSpeed } from '../utils/format';

export function StartTrip() {
  const navigate = useNavigate();
  const { activeVehicle } = useAppData();
  const { state, start, pause, resume, end } = useLiveTrip();
  const [finalizing, setFinalizing] = useState(false);

  async function handleEnd() {
    setFinalizing(true);
    const result = await end();
    navigate('/trip/fuel-entry', { state: result });
  }

  const gpsBadge = state.gpsSource === 'gps' ? (
    <Badge tone="accent" icon={<WifiIcon size={13} />}>
      GPS live{state.accuracyM != null ? ` · ±${state.accuracyM} m` : ''}
    </Badge>
  ) : state.gpsSource === 'simulated' ? (
    <Badge tone="warn" icon={<WifiOffIcon size={13} />}>
      Simulated — GPS unavailable
    </Badge>
  ) : (
    <Badge tone="muted" icon={<WifiOffIcon size={13} />}>
      GPS Unavailable
    </Badge>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-6 py-8 md:py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-soft">Start Your Trip</h1>
            <p className="mt-0.5 text-sm text-muted">{activeVehicle.name}</p>
          </div>
          {gpsBadge}
        </div>

        {(state.geoContext || state.environment) &&
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {state.geoContext &&
        <Badge tone="muted" icon={<MapPinIcon size={12} />}>
                {[state.geoContext.city, state.geoContext.state, state.geoContext.country].filter(Boolean).join(', ') ||
          'Location detected'}
            </Badge>
        }
            {state.environment &&
        <Badge tone="muted" icon={<ThermometerIcon size={12} />}>
                {Math.round(state.environment.temperatureC)}°C
            </Badge>
        }
            {state.environment && state.environment.aqi > 0 &&
        <Badge tone={state.environment.aqi <= 100 ? 'success' : 'warn'} icon={<CloudFogIcon size={12} />}>
                AQI {state.environment.aqi} · {aqiLabel(state.environment.aqi).label}
            </Badge>
        }
          </div>
        }

        <div className="mt-8 rounded-3xl border border-white/10 bg-surface/60 p-6">
          <SpeedGauge speedKmh={state.currentSpeedKmh} active={state.status === 'active'} />

          <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-5">
            <Stat label="Distance" value={formatDistance(state.distanceKm)} />
            <Stat label="Avg speed" value={formatSpeed(state.avgSpeedKmh)} />
            <Stat label="Duration" value={formatDuration(state.durationSec)} />
          </div>
        </div>

        <div className="mt-5">
          <RoutePath progress={state.routeProgress} active={state.status === 'active'} />
        </div>

        <div className="mt-6 flex gap-2.5 rounded-xl border border-warn/20 bg-warn/10 p-3.5 text-xs leading-relaxed text-soft">
          <ShieldAlertIcon size={16} className="mt-0.5 shrink-0 text-warn" />
          <p>Start tracking before driving. Do not operate the phone while the vehicle is moving.</p>
        </div>

        {state.status === 'idle' &&
        <p className="mt-2.5 text-xs leading-relaxed text-muted">
            Veylora will ask for location access to record real distance and speed. If GPS is unavailable or denied, the trip is simulated and its results are marked lower quality.
          </p>
        }

        {state.status === 'active' && state.gpsSource === 'simulated' &&
        <p className="mt-2.5 text-xs leading-relaxed text-warn">
            Live GPS could not be reached, so this trip is being simulated. Save it and it will be labelled as estimated, not measured.
          </p>
        }

        <div className="mt-6">
          {state.status === 'idle' &&
          <>
              <Button size="lg" className="w-full" onClick={start}>
                <PlayIcon size={18} />
                Start Trip
              </Button>
              <Link
              to="/trip/fuel-entry"
              className="mt-3 block text-center text-sm font-medium text-muted hover:text-soft">
              
                Log a completed trip manually
              </Link>
            </>
          }

          {(state.status === 'active' || state.status === 'paused') &&
          <div className="flex gap-3">
              {state.status === 'active' ?
            <Button size="lg" variant="outline" className="flex-1" onClick={pause} disabled={finalizing}>
                  <PauseIcon size={18} />
                  Pause
                </Button> :

            <Button size="lg" className="flex-1" onClick={resume} disabled={finalizing}>
                  <PlayIcon size={18} />
                  Resume
                </Button>
            }
              <Button size="lg" variant="danger" className="flex-1" onClick={handleEnd} disabled={finalizing}>
                <SquareIcon size={16} />
                End
              </Button>
            </div>
          }

          {state.status === 'completed' &&
          <p className="text-center text-sm text-muted">
              {finalizing ? 'Finalising trip context (weather, AQI, roads)…' : 'Redirecting to fuel entry…'}
            </p>
          }
        </div>
      </div>
    </AppShell>);

}

function Stat({ label, value }: {label: string;value: string;}) {
  return (
    <div className="px-2 text-center first:pl-0 last:pr-0">
      <p className="text-base font-bold tabular-nums text-soft">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>);

}