import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DownloadIcon,
  ShareIcon,
  PlusSquareIcon,
  MoreVerticalIcon,
  SmartphoneIcon,
  CheckCircle2Icon,
  WifiOffIcon,
} from 'lucide-react';
import { usePwa } from '../hooks/usePwa';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  isAndroidDevice,
  isIosDevice,
  isInAppBrowser,
  isStandaloneDisplay,
} from '../utils/pwa';
import { Button } from './ui/Button';
import { Logo } from './Logo';

const SESSION_KEY = 'veylora.installGateReleased';

function readSessionReleased(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function MobileInstallGate() {
  const { canInstall, appInstalled, install } = usePwa();
  const reduced = usePrefersReducedMotion();
  const [installing, setInstalling] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [released, setReleased] = useState(readSessionReleased);

  if (typeof window === 'undefined') return null;

  const android = isAndroidDevice();
  const ios = isIosDevice();
  const mobile = android || ios;
  const inApp = isInAppBrowser();
  const standalone = isStandaloneDisplay();
  const canNativeInstall = android && canInstall;

  // Force install: the app is only usable from the home-screen shortcut
  // (standalone display). The sole escape is an in-app browser, where the
  // native install flow is impossible.
  const blocked = mobile && !standalone && !(inApp && released);
  if (!blocked) return null;

  function releaseForSession() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch { /* storage unavailable */ }
    setReleased(true);
  }

  async function handleInstall() {
    setInstalling(true);
    await install();
    setInstalling(false);
  }

  const steps = android
    ? [
        { icon: MoreVerticalIcon, text: 'Open the browser menu (\u22ee) at the top-right.' },
        { icon: DownloadIcon, text: 'Tap "Install app" or "Add to Home screen".' },
        { icon: SmartphoneIcon, text: 'Confirm, then open Veylora from your home screen.' },
      ]
    : [
        { icon: ShareIcon, text: 'Tap the Share button in the Safari toolbar.' },
        { icon: PlusSquareIcon, text: 'Choose "Add to Home Screen".' },
        { icon: SmartphoneIcon, text: 'Tap "Add", then open Veylora from your home screen.' },
      ];

  const stepsOpen = showSteps || ios;

  const body = (
    <div className="w-full max-w-md">
      <div className="flex justify-center">
        <Logo variant="full" size={34} theme="dark" />
      </div>

      <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-soft">
        Install Veylora to continue
      </h1>
      <p className="mt-3 text-center text-sm leading-relaxed text-muted">
        Veylora is a phone app. Install it to your home screen to open it
        full-screen, use it offline, and keep all your data safely on your device.
      </p>

      {inApp && (
        <div className="mt-5 rounded-2xl border border-warn/30 bg-warn/10 p-4 text-xs leading-relaxed text-soft">
          You are viewing this page inside another app. To install Veylora, open this page in{' '}
          <span className="font-semibold">{ios ? 'Safari' : 'Chrome'}</span> first.
        </div>
      )}

      {!inApp && appInstalled && !standalone && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm leading-relaxed text-soft">
          <CheckCircle2Icon size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <span>
            Veylora is installed. Close this tab and open the app from your home screen
            to continue.
          </span>
        </div>
      )}

      {!inApp && !appInstalled && (
        <Button
          className="mt-6 w-full"
          size="lg"
          onClick={canNativeInstall ? handleInstall : () => setShowSteps(true)}
          disabled={installing}>
          <DownloadIcon size={18} aria-hidden="true" />
          {installing ? 'Opening installer\u2026' : 'Install Now'}
        </Button>
      )}

      {!inApp && !canNativeInstall && !appInstalled && stepsOpen && (
        <ol className="mt-5 space-y-3">
          {steps.map((step, i) => (
            <li key={step.text} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <step.icon size={17} aria-hidden="true" />
              </span>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-soft">Step {i + 1}. </span>
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      )}

      {!inApp && (
        <p className="mt-5 text-center text-xs leading-relaxed text-muted">
          After installing, open Veylora from your home screen. The website stays
          locked until you do.
        </p>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
        <WifiOffIcon size={14} className="text-accent" aria-hidden="true" />
        Works offline. No app store. No account.
      </div>

      {inApp && (
        <button
          type="button"
          onClick={releaseForSession}
          className="mx-auto mt-5 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-muted transition-colors hover:text-soft">
          <CheckCircle2Icon size={14} aria-hidden="true" />
          Continue in browser
        </button>
      )}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install Veylora"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy px-6 py-10">
      {reduced
        ? body
        : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-md">
            {body}
          </motion.div>
        )}
    </div>
  );
}
