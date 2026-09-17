export function isDevHost(): boolean {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
}

export function registerServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return Promise.resolve();
  if (isDevHost()) return Promise.resolve();
  const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
  const swUrl = manifestLink ? new URL('sw.js', manifestLink.href).href : '/sw.js';
  return navigator.serviceWorker.register(swUrl).then(() => undefined).catch(() => undefined);
}

export function makeStoragePersistent(): Promise<boolean> {
  const nav = navigator as Navigator & { storage?: { persist?: () => Promise<boolean> } };
  if (!nav.storage || typeof nav.storage.persist !== 'function') return Promise.resolve(false);
  return nav.storage.persist().catch(() => false);
}

export function requestPersistentStorageOnUse(): void {
  if (typeof window === 'undefined') return;
  const request = () => {
    makeStoragePersistent();
    window.removeEventListener('pointerdown', request);
    window.removeEventListener('keydown', request);
  };
  window.addEventListener('pointerdown', request);
  window.addEventListener('keydown', request);
}