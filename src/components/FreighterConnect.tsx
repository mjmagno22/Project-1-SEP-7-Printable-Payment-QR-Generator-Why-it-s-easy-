'use client';

interface FreighterConnectProps {
  isInstalled: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function FreighterConnect({
  isInstalled,
  address,
  isConnecting,
  error,
  onConnect,
  onDisconnect,
}: FreighterConnectProps) {
  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1.5 sm:flex">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          <span className="font-mono text-xs text-[var(--foreground)]">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={onDisconnect}
          className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 font-body text-xs font-medium text-[var(--color-muted-fg)] transition-all hover:border-red-300 hover:text-red-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (isInstalled) {
    return (
      <button
        onClick={onConnect}
        disabled={isConnecting}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2 font-body text-xs font-medium text-[var(--color-primary)] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isConnecting ? (
          <>
            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect Freighter
          </>
        )}
      </button>
    );
  }

  return (
    <a
      href="https://freighter.app"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 font-body text-xs font-medium text-amber-700 transition-all hover:bg-amber-100"
    >
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Get Freighter
    </a>
  );

  // Error tooltip is rendered in the header overlay
}
