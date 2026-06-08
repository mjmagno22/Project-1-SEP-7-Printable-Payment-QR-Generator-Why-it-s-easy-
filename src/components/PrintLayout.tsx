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
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-6 py-3.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] active:shadow-none"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print QR Code
        </button>
      </div>

      {/* Print-only layout — pure black-on-white for newsprint */}
      <div
        ref={printRef}
        className="print-only mx-auto mt-6 max-w-md"
      >
        <div className="rounded-xl border-2 border-gray-300 bg-white p-8 text-center print:border-gray-400 print:shadow-none">
          {title && (
            <h2 className="font-sans text-xl font-bold text-black">
              {title}
            </h2>
          )}

          <div className="my-6 flex justify-center">
            <QrDisplay
              uri={uri}
              showUri={false}
            />
          </div>

          <div className="space-y-1.5 font-body text-sm text-black">
            <p className="font-sans text-base font-semibold">
              Scan with your Stellar wallet
            </p>
            <p>
              Send{' '}
              <span className="font-semibold">
                {params.amount || 'any amount'}{' '}
                {assetLabel(params.assetCode)}
              </span>
            </p>
            <p className="break-all font-mono text-xs text-gray-600">
              {params.destination}
            </p>
            {params.memo && (
              <p className="text-xs text-gray-600">Memo: {params.memo}</p>
            )}
            {params.msg && (
              <p className="text-xs italic text-gray-600">&ldquo;{params.msg}&rdquo;</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
