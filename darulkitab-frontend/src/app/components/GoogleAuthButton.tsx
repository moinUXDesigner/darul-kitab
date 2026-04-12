import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]');

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Sign-In.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In.'));
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
}

interface GoogleAuthButtonProps {
  mode: 'login' | 'signup';
  loading?: boolean;
  error?: string;
  onCredential: (credential: string) => Promise<void> | void;
  onStatusMessage?: (message: string) => void;
}

export function GoogleAuthButton({
  mode,
  loading = false,
  error,
  onCredential,
  onStatusMessage,
}: GoogleAuthButtonProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const onCredentialRef = useRef(onCredential);
  const [sdkReady, setSdkReady] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');

  onCredentialRef.current = onCredential;

  useEffect(() => {
    if (!clientId) {
      setSetupMessage('Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in.');
      return;
    }

    let cancelled = false;

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();

        if (cancelled || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential?: string }) => {
            if (!response?.credential) {
              onStatusMessage?.('Google sign-in was cancelled. Please try again.');
              return;
            }

            onStatusMessage?.('');

            try {
              await onCredentialRef.current(response.credential);
            } catch (err: any) {
              onStatusMessage?.(err?.message || 'Google sign-in failed. Please try again.');
            }
          },
        });

        if (buttonRef.current) {
          buttonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            shape: 'pill',
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            width: Math.max(280, Math.min(392, buttonRef.current.offsetWidth || 320)),
          });
        }

        setSetupMessage('');
        setSdkReady(true);
      } catch (err: any) {
        const message = err?.message || 'Google sign-in is unavailable right now.';
        setSetupMessage(message);
        onStatusMessage?.(message);
      }
    };

    initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, [clientId, mode, onStatusMessage]);

  if (!clientId) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted-foreground opacity-70"
        >
          Continue with Google
        </button>
        <p className="text-xs text-muted-foreground">{setupMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`relative min-h-11 ${loading ? 'pointer-events-none opacity-70' : ''}`}>
        {!sdkReady && (
          <div className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing Google sign-in...
          </div>
        )}

        <div
          ref={buttonRef}
          className={`${sdkReady ? 'block' : 'hidden'} overflow-hidden rounded-2xl`}
        />
      </div>

      {(error || setupMessage) && (
        <p className="text-xs text-destructive">{error || setupMessage}</p>
      )}
    </div>
  );
}
