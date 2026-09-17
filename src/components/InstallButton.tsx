import React, { useState } from 'react';
import {
  DownloadIcon,
  ShareIcon,
  PlusSquareIcon,
  MoreVerticalIcon,
  SmartphoneIcon,
  XIcon,
} from 'lucide-react';
import { usePwa } from '../hooks/usePwa';
import { isAndroidDevice, isIosDevice, isMobileDevice } from '../utils/pwa';
import { Button } from './ui/Button';
import { ButtonSize, ButtonTheme, ButtonVariant } from './ui/buttonStyles';

interface InstallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  theme?: ButtonTheme;
  size?: ButtonSize;
  label?: string;
}

export function InstallButton({
  label = 'Install',
  variant = 'primary',
  theme = 'dark',
  size = 'sm',
  className = '',
  ...rest
}: InstallButtonProps) {
  const { canInstall, appInstalled, install } = usePwa();
  const [help, setHelp] = useState(false);

  if (appInstalled) return null;
  if (!canInstall && !isMobileDevice()) return null;

  async function handleClick() {
    if (canInstall) {
      await install();
    } else {
      setHelp(true);
    }
  }

  return (
    <>
      <Button variant={variant} theme={theme} size={size} className={className} onClick={handleClick} {...rest}>
        <DownloadIcon size={16} aria-hidden="true" />
        {label}
      </Button>
      {help && <InstallHelp onClose={() => setHelp(false)} />}
    </>
  );
}

function InstallHelp({ onClose }: { onClose: () => void }) {
  const android = isAndroidDevice();
  const ios = isIosDevice();

  const steps = android
    ? [
        { icon: MoreVerticalIcon, text: 'Open the browser menu (\u22ee) at the top-right.' },
        { icon: DownloadIcon, text: 'Tap "Install app" or "Add to Home screen".' },
        { icon: SmartphoneIcon, text: 'Confirm, then open Veylora from your home screen.' },
      ]
    : ios
      ? [
          { icon: ShareIcon, text: 'Tap the Share button in the Safari toolbar.' },
          { icon: PlusSquareIcon, text: 'Choose "Add to Home Screen".' },
          { icon: SmartphoneIcon, text: 'Tap "Add", then open Veylora from your home screen.' },
        ]
      : [
          { icon: MoreVerticalIcon, text: 'Open your browser menu.' },
          { icon: DownloadIcon, text: 'Choose "Install" or "Add to Home screen".' },
          { icon: SmartphoneIcon, text: 'Confirm to finish installing Veylora.' },
        ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How to install Veylora"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-6 py-10 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-navydark p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-soft">Install Veylora</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Add Veylora to your home screen — full-screen, offline, no app store.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-lg p-1.5 text-muted transition-colors hover:text-soft">
            <XIcon size={16} aria-hidden="true" />
          </button>
        </div>

        <ol className="mt-5 space-y-3">
          {steps.map((step, i) => (
            <li key={step.text} className="flex items-start gap-3">
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

        <Button className="mt-6 w-full" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}