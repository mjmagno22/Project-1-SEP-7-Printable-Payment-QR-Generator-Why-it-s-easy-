'use client';

import { useState } from 'react';
import type { Sep7PayParams } from '@/lib/sep7';
import QrForm from '@/components/QrForm';
import QrDisplay from '@/components/QrDisplay';
import PrintLayout from '@/components/PrintLayout';
import { buildSep7Uri } from '@/lib/sep7';

export default function Home() {
  const [params, setParams] = useState<Sep7PayParams | null>(null);
  const uri = params ? buildSep7Uri(params) : '';

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Stellar SEP-7 QR
            </h1>
            <p className="text-xs text-gray-500">
              Printable payment QR codes for print media
            </p>
          </div>
          <a
            href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            SEP-7 Spec
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        {/* Intro */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Generate a Printable Stellar QR Code
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Turn any payment or donation request into a SEP-7 URI rendered as a
            QR code — perfect for newspapers, posters, church bulletins, and
            any static print media.
          </p>
        </div>

        {/* Two-column layout: form + preview */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <QrForm onGenerate={setParams} />
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Preview
              </h3>
              {uri ? (
                <div className="flex flex-col gap-4">
                  <QrDisplay uri={uri} label="Scan with Freighter or any Stellar wallet" />
                  <PrintLayout params={params!} title="Donate with Stellar" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                  <svg
                    className="mb-3 h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p className="text-sm">
                    Fill in the form to generate a QR code.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How it works */}
        {uri && (
          <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              📖 How to use this in print
            </h3>
            <ol className="ml-5 list-decimal space-y-2 text-sm text-gray-600">
              <li>
                <strong>Fill in the details</strong> — destination address,
                amount (optional), and asset.
              </li>
              <li>
                <strong>Click &quot;Print QR Code&quot;</strong> — a
                print-optimised page opens with just the QR code and details.
              </li>
              <li>
                <strong>Include in your publication</strong> — paste the QR
                image into a newspaper, poster, flyer, or bulletin.
              </li>
              <li>
                <strong>Readers scan with Freighter</strong> — the wallet
                auto-fills the destination, amount, and memo from the SEP-7
                URI.
              </li>
            </ol>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 text-center text-xs text-gray-400">
          Powered by{' '}
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Stellar
          </a>{' '}
          ·{' '}
          <a
            href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            SEP-7
          </a>{' '}
          · Built for StellarX PH @ PUP QC
        </div>
      </footer>
    </div>
  );
}
