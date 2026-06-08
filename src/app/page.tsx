'use client';

import { useState, useCallback } from 'react';
import type { Sep7PayParams } from '@/lib/sep7';
import QrForm from '@/components/QrForm';
import QrDisplay from '@/components/QrDisplay';
import PrintLayout from '@/components/PrintLayout';
import FreighterConnect from '@/components/FreighterConnect';
import { useFreighter } from '@/hooks/useFreighter';
import { buildSep7Uri } from '@/lib/sep7';

export default function Home() {
  const [params, setParams] = useState<Sep7PayParams | null>(null);
  const [qrMode, setQrMode] = useState<'simple' | 'full'>('simple');
  const [addrCopied, setAddrCopied] = useState(false);
  const uri = params ? buildSep7Uri(params) : '';
  const simpleUri = params?.destination ?? '';
  const { isInstalled, address: walletAddress, isConnecting, error, connect, disconnect } = useFreighter();

  const handleCopyAddress = useCallback(() => {
    if (!params?.destination) return;
    navigator.clipboard.writeText(params.destination);
    setAddrCopied(true);
    setTimeout(() => setAddrCopied(false), 2000);
  }, [params]);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm no-print">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <svg
                className="h-5 w-5"
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
            </div>
            <div>
              <span className="font-sans text-lg font-semibold text-[var(--foreground)]">
                SEP-7 QR
              </span>
              <span className="ml-2 rounded-full bg-[var(--color-muted)] px-2.5 py-0.5 font-body text-[11px] font-medium text-[var(--color-muted-fg)]">
                Generator
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FreighterConnect
              isInstalled={isInstalled}
              address={walletAddress}
              isConnecting={isConnecting}
              error={error}
              onConnect={connect}
              onDisconnect={disconnect}
            />
            <a
              href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2 font-body text-xs font-medium text-[var(--color-muted-fg)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:inline-block"
            >
              SEP-7 Spec →
            </a>
          </div>
        </div>
      </header>

      {/* ── Freighter error banner ────────────────────────── */}
      {error && (
        <div className="no-print border-b border-red-200 bg-red-50">
          <div className="mx-auto flex max-w-5xl items-center gap-2 px-6 py-2.5 font-body text-xs text-red-700">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        {/* Hero */}
        <section className="mb-14 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-muted)] px-4 py-1.5 font-body text-xs font-medium text-[var(--color-muted-fg)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            SEP-7 Compliant
          </div>

          {walletAddress && (
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 font-body text-xs font-medium text-green-700">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              Wallet connected — {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          )}
          <h1 className="font-sans text-3xl font-bold leading-tight text-[var(--foreground)] sm:text-[2.75rem] sm:leading-[1.15]">
            Printable Stellar
            <br />
            Payment QR Codes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg leading-relaxed text-[var(--color-muted-fg)]">
            Turn any donation or payment request into a SEP-7 URI rendered as a
            high-contrast QR code — ready for newspapers, posters, church
            bulletins, and any print medium.
          </p>
        </section>

        {/* Form + Preview grid — swapped: preview gets 3/5 for bigger QR */}
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
                <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9H9m6 4H9m6 4H9m3-12l-6 6m6-6l6 6" />
                </svg>
                <h2 className="font-sans text-sm font-semibold text-[var(--foreground)]">
                  Payment Details
                </h2>
              </div>
              <QrForm onGenerate={setParams} walletAddress={walletAddress} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-7 shadow-sm lg:sticky lg:top-8">
              <div className="mb-5 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
                <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1m0 0l-2 1m2 1v2.5M13 11h6" />
                </svg>
                <h2 className="font-sans text-sm font-semibold text-[var(--foreground)]">
                  Preview
                </h2>
              </div>

              {uri ? (
                <div className="flex flex-col items-center gap-5">
                  {/* ── Destination address (prominent copy) ──── */}
                  <div className="w-full rounded-lg border border-[var(--color-primary)] bg-[var(--color-muted)] p-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-body text-xs font-medium text-[var(--color-muted-fg)]">
                        Destination Address
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-body text-[10px] font-medium text-green-700">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                        Copy &amp; paste into Freighter
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={params!.destination}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="flex-1 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 font-mono text-xs text-[var(--foreground)]"
                      />
                      <button
                        onClick={handleCopyAddress}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-body text-xs font-semibold text-white transition-all hover:bg-[var(--color-primary-dark)] active:scale-[0.97]"
                        title="Copy address to clipboard"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          {addrCopied ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <>
                              <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={1.5} />
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={1.5} />
                            </>
                          )}
                        </svg>
                        {addrCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
                      Copy this address and paste it into the &quot;To&quot; field in your Freighter mobile app to send a payment.
                    </p>
                  </div>

                  {/* ── QR mode toggle ────────────────────────── */}
                  <div className="flex w-full rounded-lg border border-[var(--color-border)] p-1">
                    <button
                      onClick={() => setQrMode('simple')}
                      className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-center font-body text-xs font-medium transition-all ${
                        qrMode === 'simple'
                          ? 'bg-[var(--color-primary)] text-white shadow-sm'
                          : 'text-[var(--color-muted-fg)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      Simple QR (Address)
                    </button>
                    <button
                      onClick={() => setQrMode('full')}
                      className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-center font-body text-xs font-medium transition-all ${
                        qrMode === 'full'
                          ? 'bg-[var(--color-primary)] text-white shadow-sm'
                          : 'text-[var(--color-muted-fg)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      Full QR (SEP-7 Payment)
                    </button>
                  </div>

                  <div className="flex justify-center w-full">
                    {qrMode === 'simple' ? (
                      <QrDisplay
                        uri={simpleUri}
                        label="Scan with any camera — shows the address"
                        showUri={false}
                      />
                    ) : (
                      <QrDisplay
                        uri={uri}
                        label="Scan with SEP-7 compatible wallet"
                      />
                    )}
                  </div>

                  <div className="w-full rounded-lg bg-[var(--color-muted)] p-4">
                    <PrintLayout params={params!} title="Donate with Stellar" />
                  </div>

                  {/* ── Instructions ─────────────────────────── */}

                  {/* ── Instructions ─────────────────────────── */}
                  <div className="w-full space-y-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="font-body text-xs font-medium text-amber-800">
                      How to scan from another phone:
                    </p>
                    <ol className="ml-4 list-decimal space-y-1 font-body text-xs text-amber-700">
                      <li><strong>Simple QR</strong> &mdash; Scan with any phone camera. It reads: <code className="rounded bg-amber-100 px-1">{params!.destination.slice(0, 8)}...</code>. Open Freighter and paste the address in the &quot;To&quot; field.</li>
                      <li><strong>Full QR</strong> &mdash; Scan with a SEP-7 compatible wallet. Auto-fills destination, amount, and memo.</li>
                      <li><strong>Or just copy</strong> the address above, send it to your phone, and paste it in Freighter.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted)]">
                    <svg
                      className="h-8 w-8 text-[var(--color-muted-fg)]"
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
                  </div>
                  <p className="font-body text-sm text-[var(--color-muted-fg)]">
                    Fill in the form to generate your QR code.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How it works */}
        {uri && (
          <section className="no-print mt-10 rounded-xl border border-[var(--color-border)] bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="font-sans text-base font-semibold text-[var(--foreground)]">
                How to use this in print
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '1', title: 'Fill in details', desc: 'Enter the destination address, amount (optional), and asset.' },
                { step: '2', title: 'Click &ldquo;Print QR Code&rdquo;', desc: 'A print-optimised page opens with the QR code and payment details.' },
                { step: '3', title: 'Include in publication', desc: 'Paste the QR into a newspaper, poster, flyer, or bulletin.' },
                { step: '4', title: 'Readers scan & pay', desc: 'Freighter or any Stellar wallet auto-fills the payment from the SEP-7 URI.' },
              ].map((item) => (
                <div key={item.step} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-primary)] font-sans text-xs font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mb-1 font-sans text-sm font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs leading-relaxed text-[var(--color-muted-fg)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="no-print border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-6 sm:flex-row">
          <p className="font-body text-xs text-[var(--color-muted-fg)]">
            Powered by{' '}
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-2 transition hover:decoration-[var(--color-primary)]"
            >
              Stellar
            </a>
            {' · '}
            <a
              href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-2 transition hover:decoration-[var(--color-primary)]"
            >
              SEP-7
            </a>
          </p>
          <p className="font-body text-xs text-[var(--color-muted-fg)]">
            Built for StellarX PH @ PUP QC
          </p>
        </div>
      </footer>
    </div>
  );
}
