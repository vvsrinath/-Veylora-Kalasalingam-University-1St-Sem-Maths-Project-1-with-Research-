import React, { useState } from 'react';
import { DownloadIcon, RotateCcwIcon, WifiOffIcon, AccessibilityIcon, RulerIcon, SmartphoneIcon, ShieldCheckIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { useAppData } from '../contexts/AppDataContext';
import { usePwa } from '../hooks/usePwa';

export function Settings() {
  const { settings, updateSettings, vehicles, trips, clearAllData } = useAppData();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const { swStatus, canInstall, appInstalled, install, storagePersistent, storageUsedMb, storageTotalMb } = usePwa();

  function handleExport() {
    const payload = { exportedAt: new Date().toISOString(), vehicles, trips };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veylora-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    clearAllData();
    setConfirmingClear(false);
  }

  return (
    <AppShell background="bg-soft">
      <div className="mx-auto max-w-lg px-6 py-8 md:py-12">
        <h1 className="text-xl font-bold text-lighttext">Settings</h1>

        <div className="mt-6 divide-y divide-lightborder overflow-hidden rounded-2xl border border-lightborder bg-white">
          <Row
            icon={WifiOffIcon}
            title="Offline Mode"
            description="Keep core features available without a connection."
            control={<Toggle checked={settings.offlineMode} onChange={(v) => updateSettings({ offlineMode: v })} />} />
          
          <Row
            icon={AccessibilityIcon}
            title="Reduce motion"
            description="Replace animations with static visuals across the app."
            control={<Toggle checked={settings.reducedMotion} onChange={(v) => updateSettings({ reducedMotion: v })} />} />
          
          <Row icon={RulerIcon} title="Units" description="Distance and volume units." control={<span className="text-sm font-medium text-lightmuted">Metric</span>} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-lightmuted">App &amp; offline</p>
        <div className="mt-3 divide-y divide-lightborder overflow-hidden rounded-2xl border border-lightborder bg-white">
          <Row
            icon={SmartphoneIcon}
            title="Install app"
            description="Add to your home screen. It opens like a native app."
            control={
              canInstall ?
              <Button size="sm" onClick={install}>
                  Install
                </Button> :
              <span className="text-sm font-medium text-lightmuted">
                  {appInstalled ? 'Installed' : 'Available in Chrome / Edge'}
                </span>
            } />
          
          <Row
            icon={WifiOffIcon}
            title="Works offline"
            description={swStatus === 'ready' ? 'Fully usable with no internet.' : 'Keep core features available without a connection.'}
            control={
              <span className={`flex items-center gap-1.5 text-sm font-medium ${swStatus === 'ready' ? 'text-success' : 'text-lightmuted'}`}>
                <span className={`h-2 w-2 rounded-full ${swStatus === 'ready' ? 'bg-success' : 'bg-lightborder'}`} aria-hidden="true" />
                {swStatus === 'ready' ? 'Ready' : 'Loading'}
              </span>
            } />
          
          <Row
            icon={ShieldCheckIcon}
            title="Permanent storage"
            description="Keeps your data safe from automatic browser cleanup."
            control={
              <span title={storageUsedMb != null && storageTotalMb != null ? `${storageUsedMb} MB used of ~${storageTotalMb} MB` : undefined} className="text-sm font-medium text-lightmuted">
                {storagePersistent === true ? 'Protected' : storagePersistent === false ? 'Standard' : '—'}
              </span>
            } />
        </div>

        {(storageUsedMb != null && storageTotalMb != null) &&
        <p className="mt-2 text-xs text-lightmuted">
            {storageUsedMb} MB of ~{storageTotalMb} MB used locally. Export regularly to keep a permanent backup.
          </p>
        }

        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-lightmuted">Your data</p>
        <div className="mt-3 space-y-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex w-full items-center gap-3 rounded-2xl border border-lightborder bg-white p-4 text-left transition-colors duration-150 hover:bg-black/[0.015]">
            
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <DownloadIcon size={17} />
            </span>
            <span>
              <span className="block text-sm font-medium text-lighttext">Export your data</span>
              <span className="block text-xs text-lightmuted">Download vehicles and trips as a JSON file.</span>
            </span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="flex w-full items-center gap-3 rounded-2xl border border-danger/20 bg-white p-4 text-left transition-colors duration-150 hover:bg-danger/5">
            
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <RotateCcwIcon size={17} />
            </span>
            <span>
              <span className="block text-sm font-medium text-danger">
                {confirmingClear ? 'Tap again to confirm reset' : 'Reset local data'}
              </span>
              <span className="block text-xs text-lightmuted">Clears vehicles and trips stored on this device.</span>
            </span>
          </button>
          {confirmingClear &&
          <Button variant="outline" theme="light" size="sm" onClick={() => setConfirmingClear(false)}>
              Cancel
            </Button>
          }
        </div>

        <p className="mt-8 text-xs leading-relaxed text-lightmuted">
          Veylora v1.0. All data is stored on your device. Nothing is uploaded unless you export it yourself.
        </p>
      </div>
    </AppShell>);

}

interface RowProps {
  icon: React.ComponentType<{size?: number;}>;
  title: string;
  description: string;
  control: React.ReactNode;
}

function Row({ icon: Icon, title, description, control }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon size={17} />
        </span>
        <div>
          <p className="text-sm font-medium text-lighttext">{title}</p>
          <p className="text-xs text-lightmuted">{description}</p>
        </div>
      </div>
      {control}
    </div>);

}

function Toggle({ checked, onChange }: {checked: boolean;onChange: (value: boolean) => void;}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-out ${
      checked ? 'bg-accent' : 'bg-lightborder'}`
      }>
      
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ease-out ${
        checked ? 'translate-x-5' : 'translate-x-0.5'}`
        } />
      
    </button>);

}