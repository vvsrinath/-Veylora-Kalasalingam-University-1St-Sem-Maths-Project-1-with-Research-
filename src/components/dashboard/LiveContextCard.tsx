import React from 'react';
import { MapPinIcon, ThermometerIcon, CloudFogIcon, RefreshCwIcon, NavigationIcon } from 'lucide-react';
import { useCurrentSnapshot } from '../../hooks/useCurrentSnapshot';
import { aqiLabel } from '../../utils/environmentApi';

export function LiveContextCard() {
  const { status, geoContext, environment, refresh } = useCurrentSnapshot();

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/60 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-soft">Live environment</h2>
        {status === 'ready' &&
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            <RefreshCwIcon size={13} />
            Refresh
          </button>
        }
      </div>

      {status === 'idle' &&
      <button
        type="button"
        onClick={refresh}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-soft">
          <NavigationIcon size={15} />
          Use my location for local weather &amp; air quality
        </button>
      }

      {status === 'loading' &&
      <p className="mt-4 animate-pulse text-sm text-muted">Fetching local conditions…</p>
      }

      {status === 'denied' &&
      <p className="mt-4 text-sm text-muted">
          Location permission is off. Enable it to see local temperature and air quality.
        </p>
      }

      {status === 'error' &&
      <p className="mt-4 text-sm text-muted">
          Could not reach the free weather service. Check your connection and try again.
        </p>
      }

      {status === 'ready' &&
      <div className="mt-4 space-y-3">
          {geoContext &&
        <p className="flex items-center gap-1.5 text-xs text-muted">
              <MapPinIcon size={13} className="text-accent" />
              {[geoContext.city, geoContext.state, geoContext.country].filter(Boolean).join(', ')}
            </p>
        }
          <div className="grid grid-cols-2 gap-3">
            {environment &&
          <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <ThermometerIcon size={12} />
                  Temperature
                </p>
                <p className="mt-0.5 text-lg font-bold text-soft">
                  {Math.round(environment.temperatureC)}°C
                </p>
                <p className="text-[11px] text-muted">feels {Math.round(environment.feelsLikeC)}° · {environment.humidity}%</p>
              </div>
          }
            {environment &&
          <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <CloudFogIcon size={12} />
                  Air quality
                </p>
                <p className="mt-0.5 text-lg font-bold text-soft">AQI {environment.aqi || '—'}</p>
                <p className="text-[11px] text-muted">
                  {aqiLabel(environment.aqi).label} · PM2.5 {environment.pm25}
                </p>
              </div>
          }
          </div>
          {environment && environment.aqi > 100 &&
        <p className="rounded-xl bg-warn/10 p-3 text-xs leading-relaxed text-soft">
              Air quality is elevated today. Reducing idling time is both cleaner and cheaper.
            </p>
        }
        </div>
      }
    </div>);

}