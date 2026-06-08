'use client';

import { useRef } from 'react';
import type { Sep7PayParams } from '@/lib/sep7';
import { buildSep7Uri, assetLabel } from '@/lib/sep7';
import QrDisplay from './QrDisplay';

interface PrintLayoutProps {
  params: Sep7PayParams;
  title?: string;
}

/**
 * Print-optimised layout — minimal chrome, large QR, human-readable details.
 * Intended for newspapers, posters, church bulletins, etc.
 *
 * The `.print-only` class hides this by default; `window.print()` renders it.
 */
export default function PrintLayout({ params, title }: PrintLayoutProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const uri = buildSep7Uri(params);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print trigger — hidden during print */}
      <div className="no-print">
        <button
          onClick={handlePrint}
          className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:bg-gray-950"
        >
          🖨️ Print QR Code
        </button>
      </div>

      {/* Print-only layout */}
      <div
        ref={printRef}
        className="print-only mx-auto mt-8 hidden max-w-md rounded-xl border-2 border-gray-200 bg-white p-8 text-center shadow-lg print:block"
      >
        {title && (
          <h2 className="mb-1 text-xl font-bold text-gray-900">{title}</h2>
        )}

        <div className="my-6 flex justify-center">
          <QrDisplay
            uri={uri}
            showUri={false}
          />
        </div>

        <div className="space-y-1 text-sm text-gray-700">
          <p className="text-base font-semibold text-gray-900">
            Scan with your Stellar wallet
          </p>
          <p>
            Send{' '}
            <span className="font-semibold">
              {params.amount || 'any amount'}{' '}
              {assetLabel(params.assetCode)}
            </span>
          </p>
          <p className="font-mono text-xs text-gray-500 break-all">
            {params.destination}
          </p>
          {params.memo && (
            <p className="text-xs text-gray-500">Memo: {params.memo}</p>
          )}
          {params.msg && (
            <p className="text-xs italic text-gray-500">"{params.msg}"</p>
          )}
        </div>
      </div>
    </>
  );
}
