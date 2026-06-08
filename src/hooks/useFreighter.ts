'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseFreighterReturn {
  isInstalled: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

/**
 * Hook for interacting with the Freighter browser extension wallet.
 * Detects Freighter by calling the API — not by checking window props.
 */
export function useFreighter(): UseFreighterReturn {
  const [isInstalled, setIsInstalled] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect Freighter on mount
  useEffect(() => {
    let cancelled = false;

    async function detect() {
      try {
        // Dynamic import so it doesn't throw at build time
        const freighter = await import('@stellar/freighter-api');
        const { isAllowed } = freighter;
        await isAllowed();
        if (!cancelled) setIsInstalled(true);
      } catch {
        // Freighter not installed — that's OK
        if (!cancelled) setIsInstalled(false);
      }
    }

    detect();
    return () => { cancelled = true; };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      const freighter = await import('@stellar/freighter-api');

      // Re-check installation via API
      try {
        await freighter.isAllowed();
      } catch {
        setError('Freighter is not installed. Install it from freighter.app.');
        setIsInstalled(false);
        return;
      }

      const result = await freighter.requestAccess();

      if (result.error) {
        setError(result.error);
      } else if (result.address) {
        setAddress(result.address);
        setIsInstalled(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes('reject') || msg.includes('denied') || msg.includes('cancel')) {
          setError('Connection was rejected.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to connect to Freighter.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  return { isInstalled, address, isConnecting, error, connect, disconnect };
}
