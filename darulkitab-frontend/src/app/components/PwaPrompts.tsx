import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';

/* ========================
   Install Prompt
======================== */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
    else setDismissed(true);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium mb-0.5">Install App</h4>
            <p className="text-sm text-muted-foreground">
              Install Darul Kitab for a better experience with offline access.
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="p-1 rounded-lg hover:bg-muted flex-shrink-0">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Install now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================
   Update Prompt
======================== */

export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleControllerChange = () => {
      // New service worker activated — reload to get new content
      window.location.reload();
    };

    // Listen for new service worker waiting
    const checkForUpdate = async () => {
      const reg = await navigator.serviceWorker.ready;
      setRegistration(reg);

      if (reg.waiting) {
        setShowUpdate(true);
        return;
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setShowUpdate(true);
          }
        });
      });
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    checkForUpdate();

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  if (!showUpdate) return null;

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdate(false);
  };

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-in slide-in-from-top-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium mb-0.5">Update available</h4>
            <p className="text-sm text-muted-foreground">
              A new version of Darul Kitab is ready.
            </p>
          </div>
          <button onClick={() => setShowUpdate(false)} className="p-1 rounded-lg hover:bg-muted flex-shrink-0">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowUpdate(false)}
            className="flex-1 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Update now
          </button>
        </div>
      </div>
    </div>
  );
}
