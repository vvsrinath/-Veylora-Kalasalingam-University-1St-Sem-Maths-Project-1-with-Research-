import { useCallback, useEffect, useState } from 'react';
import {
  registerServiceWorker,
  isDevHost,
  hasDeferredInstallPrompt,
  subscribeInstallPrompt,
  promptInstall,
} from '../utils/pwa';

const INSTALLED_KEY = 'veylora.installed';

function readInstalledFlag(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(INSTALLED_KEY) === '1';
  } catch {
    return false;
  }
}

export interface PwaStatus {
  swStatus: 'unsupported' | 'registering' | 'ready' | 'failed';
  canInstall: boolean;
  appInstalled: boolean;
  install: () => Promise<boolean>;
  storagePersistent: boolean | null;
  storageUsedMb: number | null;
  storageTotalMb: number | null;
}

export function usePwa(): PwaStatus {
  const [swStatus, setSwStatus] = useState<PwaStatus['swStatus']>('registering');
  const [canInstall, setCanInstall] = useState(hasDeferredInstallPrompt);
  const [appInstalled, setAppInstalled] = useState(readInstalledFlag);
  const [storagePersistent, setStoragePersistent] = useState<boolean | null>(null);
  const [storageUsedMb, setStorageUsedMb] = useState<number | null>(null);
  const [storageTotalMb, setStorageTotalMb] = useState<number | null>(null);

  const refreshStorage = useCallback(() => {
    const nav = navigator as Navigator & { storage?: { persisted?: () => Promise<boolean>; estimate: () => Promise<{ usage: number | null; quota: number | null }> } };
    if (!nav.storage) return;
    if (typeof nav.storage.persisted === 'function') {
      nav.storage.persisted().then(setStoragePersistent).catch(() => undefined);
    }
    nav.storage.estimate().then((est) => {
      setStorageUsedMb(est.usage != null ? +(est.usage / (1024 * 1024)).toFixed(1) : null);
      setStorageTotalMb(est.quota != null ? +(est.quota / (1024 * 1024)).toFixed(1) : null);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      setSwStatus('unsupported');
      return;
    }
    if (isDevHost()) {
      setSwStatus('ready');
      return;
    }
    let cancelled = false;
    registerServiceWorker();
    navigator.serviceWorker.ready.then(() => {
      if (!cancelled) setSwStatus('ready');
    }).catch(() => {
      if (!cancelled) setSwStatus('failed');
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setCanInstall(hasDeferredInstallPrompt());
    const unsubscribePrompt = subscribeInstallPrompt(setCanInstall);
    const onInstalled = () => {
      try {
        localStorage.setItem(INSTALLED_KEY, '1');
      } catch { /* storage unavailable */ }
      setAppInstalled(true);
    };
    window.addEventListener('appinstalled', onInstalled);
    refreshStorage();
    return () => {
      unsubscribePrompt();
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [refreshStorage]);

  const install = useCallback(async () => {
    const accepted = await promptInstall();
    if (accepted) {
      try {
        localStorage.setItem(INSTALLED_KEY, '1');
      } catch { /* storage unavailable */ }
      setAppInstalled(true);
    }
    return accepted;
  }, []);

  return {
    swStatus,
    canInstall,
    appInstalled: appInstalled || (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches),
    install,
    storagePersistent,
    storageUsedMb,
    storageTotalMb
  };
}