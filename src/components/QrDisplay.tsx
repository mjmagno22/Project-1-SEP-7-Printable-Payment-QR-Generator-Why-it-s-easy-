'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrDisplayProps {
  uri: string;
  label?: string;
  showUri?: boolean;
  className?: string;
}

/**
 * Renders a SEP-7 URI as a high-contrast QR code on canvas.
 * Uses pure black-on-white for maximum print contrast (newsprint-safe).
 */
export default function QrDisplay({
  uri,
  label,
  showUri = true,
  className = '',
}: QrDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !uri) return;
    QRCode.toCanvas(canvasRef.current, uri, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
  }, [uri]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-[var(--color-border)]"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {label && (
        <p className="font-body text-sm font-medium text-[var(--foreground)]">
          {label}
        </p>
      )}
      {showUri && uri && (
        <div className="w-full">
          <label className="mb-1 block font-body text-xs font-medium text-[var(--color-muted-fg)]">
            SEP-7 URI
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={uri}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 font-mono text-xs text-[var(--foreground)]"
            />
            <button
              onClick={() => navigator.clipboard.writeText(uri)}
              className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 font-body text-xs font-medium text-[var(--color-muted-fg)] transition hover:bg-[var(--color-muted)] active:bg-gray-200"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
