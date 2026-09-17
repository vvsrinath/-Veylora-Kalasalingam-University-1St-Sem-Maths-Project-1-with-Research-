import { useState } from 'react';
import { motion } from 'framer-motion';
import { DownloadIcon, ShareIcon, XIcon } from 'lucide-react';
import { usePwa } from '../hooks/usePwa';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { isIosDevice, isMobileDevice } from '../utils/pwa';
import { Button } from './ui/Button';

const DISMISS_KEY = 'veylora.installDismissed';

function readDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const { canInstall, appInstalled, install } = usePwa();
  const reduced = usePrefersReducedMotion();
  const [dismissed, setDismissed] = useState(readDismissed);

  const ios = isIosDevice();
  const show = !isMobileDevice() && !dismissed && !appInstalled && (canInstall || ios);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch { /* storage unavailable */ }
    setDismissed(true);
  }

  async function handleInstall() {
    const accepted = await install();
    if (!accepted) dismiss();
  }

  if (!show) return null;

  const body = (
    <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 bg-navydark/95 p-4 shadow-card backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          {canInstall ? <DownloadIcon size={20} aria-hidden="true" /> : <ShareIcon size={20} aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-soft">Install Veylora</p>
          {canInstall
            ? (
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                Get the app on your home screen — it opens instantly, works offline, and needs no app store.
              </p>
            )
            : (
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Tap the Safari <span className="font-semibold text-soft">Share</span> button, then choose{' '}
                <span className="font-semibold text-soft">Add to Home Screen</span>.
              </p>
            )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-muted transition-colors hover:text-soft">
          <XIcon size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        {canInstall
          ? (
            <>
              <Button size="sm" onClick={handleInstall}>
                Install
              </Button>
              <Button size="sm" variant="ghost" theme="dark" onClick={dismiss}>
                Not now
              </Button>
            </>
          )
          : (
            <Button size="sm" onClick={dismiss}>
              Got it
            </Button>
          )}
      </div>
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      {reduced
        ? body
        : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
            {body}
          </motion.div>
        )}
    </div>
  );
}