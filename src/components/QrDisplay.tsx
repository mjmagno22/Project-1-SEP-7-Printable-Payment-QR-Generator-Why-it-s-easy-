'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrDisplayProps {
  uri: string;
  /** Label shown below the QR (e.g. "Pay with Stellar"). */
  label?: string;
  /** Show the raw SEP-7 URI text. */
  showUri?: boolean;
  /** Extra class name for sizing. */
  className?: string;
}

/**
 * Renders a SEP-7 URI as a QR code using an HTML Canvas.
 * Supports a print-friendly layout — pass `className="print-only"` to
 * show only in print, or wrap in a print media query.
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
        className="rounded-lg border border-gray-200"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {label && (
        <p className="text-sm font-medium text-gray-700">{label}</p>
      )}
      {showUri && uri && (
        <div className="w-full">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            SEP-7 URI
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={uri}
              className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-mono text-gray-700"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={() => navigator.clipboard.writeText(uri)}
              className="shrink-0 rounded bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 active:bg-gray-300"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
