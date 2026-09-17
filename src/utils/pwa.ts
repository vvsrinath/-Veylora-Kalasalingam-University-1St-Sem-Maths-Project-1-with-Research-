export function isDevHost(): boolean {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return Boolean(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    nav.standalone === true
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { platform?: string };
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (nav.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export function isMobileDevice(): boolean {
  return isIosDevice() || isAndroidDevice();
}

const IN_APP_BROWSER_PATTERNS = [
  /FBAN/i, /FBAV/i, /FB_IAB/i, /Instagram/i, /Line\//i, /MicroMessenger/i,
  /Twitter/i, /Snapchat/i, /TikTok/i, /BytedanceWebview/i, /LinkedInApp/i,
  /WhatsApp/i, /Pinterest/i, /GSA\//i
];

export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return IN_APP_BROWSER_PATTERNS.some((re) => re.test(ua));
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
const installPromptListeners = new Set<(canInstall: boolean) => void>();

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredInstallPrompt;
}

export function hasDeferredInstallPrompt(): boolean {
  return deferredInstallPrompt !== null;
}

export function subscribeInstallPrompt(listener: (canInstall: boolean) => void): () => void {
  installPromptListeners.add(listener);
  return () => { installPromptListeners.delete(listener); };
}

function notifyInstallPrompt(): void {
  const value = deferredInstallPrompt !== null;
  installPromptListeners.forEach((listener) => listener(value));
}

/** Fires the browser's native install prompt. Returns true if the user accepted. */
export async function promptInstall(): Promise<boolean> {
  const event = deferredInstallPrompt;
  if (!event) return false;
  deferredInstallPrompt = null;
  try {
    await event.prompt();
    const choice = await event.userChoice;
    return choice.outcome === 'accepted';
  } catch {
    return false;
  } finally {
    notifyInstallPrompt();
  }
}

/** Resolves true as soon as a native install prompt becomes available (or false on timeout). */
export function waitForInstallPrompt(timeoutMs = 2500): Promise<boolean> {
  if (deferredInstallPrompt) return Promise.resolve(true);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      unsubscribe();
      clearTimeout(timer);
      resolve(value);
    };
    const unsubscribe = subscribeInstallPrompt((canInstall) => { if (canInstall) finish(true); });
    const timer = setTimeout(() => finish(deferredInstallPrompt !== null), timeoutMs);
  });
}

/**
 * Capture `beforeinstallprompt` once, as early as possible, so no component
 * misses it (the event fires a single time per page load). Called at module
 * load below.
 */
export function initInstallPromptCapture(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    notifyInstallPrompt();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    notifyInstallPrompt();
  });
}

if (typeof window !== 'undefined') initInstallPromptCapture();

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