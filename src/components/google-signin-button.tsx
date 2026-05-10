'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';

let scriptLoaded = false;
let gsiInitialized = false;

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
}

export function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = useCallback(
    (response: any) => {
      if (response?.credential) {
        onSuccess(response.credential);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !buttonRef.current) return;

    const initGsi = () => {
      if (!window.google || !buttonRef.current) return;
      if (!gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
        });
        gsiInitialized = true;
      }
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: buttonRef.current.offsetWidth,
      });
    };

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    ) as HTMLScriptElement | null;

    if (existingScript && window.google) {
      initGsi();
      return;
    }

    if (!scriptLoaded) {
      scriptLoaded = true;
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    }
  }, [handleCredentialResponse]);

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full [&>div]:w-full" />
    </div>
  );
}

export function GoogleSignInFallback({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      onClick={onClick}
    >
      <Chrome className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}
