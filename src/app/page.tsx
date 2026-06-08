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
    <div className="flex min-h-screen flex-col">
      {/* ── Minimal header ──────────────────────────────── */}
      <header className="border-b border-[var(--color-border)] bg-white no-print">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-[var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
              <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
              <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
              <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
            </svg>
            <span className="font-sans text-lg font-semibold text-[var(--foreground)]">
              SEP-7 QR
            </span>
          </div>
          <a
            href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 font-body text-xs font-medium text-[var(--color-muted-fg)] transition hover:bg-[var(--color-muted)]"
          >
            SEP-7 Spec
          </a>
        </div>
      </header>

      {/* ── Main content — Minimal Single Column ──────────── */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="font-sans text-3xl font-bold leading-tight text-[var(--foreground)] sm:text-4xl">
            Printable Stellar Payment QR Codes
          </h1>
          <p className="mx-auto mt-3 max-w-2xl font-body text-lg text-[var(--color-muted-fg)]">
            Turn any donation or payment request into a SEP-7 URI rendered as a
            high-contrast QR code — ready for newspapers, posters, church
            bulletins, and any print medium.
          </p>
        </section>

        {/* Form + Preview grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <QrForm onGenerate={setParams} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm lg:sticky lg:top-8">
              <h2 className="mb-4 font-sans text-sm font-semibold text-[var(--foreground)]">
                Preview
              </h2>
              {uri ? (
                <div className="flex flex-col gap-4">
                  <QrDisplay uri={uri} label="Scan with any Stellar wallet" />
                  <PrintLayout params={params!} title="Donate with Stellar" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg
                    className="mb-4 h-12 w-12 text-[var(--color-muted-fg)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p className="font-body text-sm text-[var(--color-muted-fg)]">
                    Fill in the form to generate your QR code.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How it works — shown after QR generated */}
        {uri && (
          <section className="no-print mt-10 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-sans text-base font-semibold text-[var(--foreground)]">
              How to use this in print
            </h2>
            <ol className="ml-5 list-decimal space-y-3 font-body text-sm text-[var(--color-muted-fg)]">
              <li>
                <strong className="text-[var(--foreground)]">
                  Fill in the details
                </strong>{' '}
                — destination address, amount (optional), and asset.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Click &ldquo;Print QR Code&rdquo;
                </strong>{' '}
                — a print-optimised page opens with the QR code and payment
                details.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Include in your publication
                </strong>{' '}
                — paste the QR into a newspaper, poster, flyer, or bulletin.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Readers scan with their wallet
                </strong>{' '}
                — Freighter or any Stellar wallet auto-fills the destination,
                amount, and memo from the SEP-7 URI.
              </li>
            </ol>
          </section>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="no-print border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center font-body text-xs text-[var(--color-muted-fg)]">
          Powered by{' '}
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-[var(--color-primary)]"
          >
            Stellar
          </a>{' '}
          ·{' '}
          <a
            href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-[var(--color-primary)]"
          >
            SEP-7
          </a>{' '}
          · Built for StellarX PH @ PUP QC
        </div>
      </footer>
    </div>
  );
}
