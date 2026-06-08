'use client';

import { useState, useEffect } from 'react';
import type { Sep7PayParams } from '@/lib/sep7';
import { validatePayParams } from '@/lib/sep7';

interface QrFormProps {
  onGenerate: (params: Sep7PayParams) => void;
  walletAddress?: string | null;
}

/** Default USDC issuer — Circle on Mainnet.
 *  For testnet use: GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
 */
const USDC_ISSUER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

export default function QrForm({ onGenerate, walletAddress }: QrFormProps) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState<'XLM' | 'USDC'>('XLM');
  const [memo, setMemo] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto-fill destination when wallet connects
  useEffect(() => {
    if (walletAddress) {
      setDestination(walletAddress);
    }
  }, [walletAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Smart field: if user pasted a full SEP-7 URI, extract the destination
    let rawDestination = destination.trim();
    if (rawDestination.startsWith('web+stellar:pay?')) {
      try {
        const parsed = new URL(rawDestination);
        const extracted = parsed.searchParams.get('destination');
        if (extracted) rawDestination = extracted;
      } catch { /* not a valid URL, use as-is */ }
    }

    const params: Sep7PayParams = {
      destination: rawDestination,
      amount: amount || undefined,
      assetCode: asset,
      assetIssuer: asset === 'USDC' ? USDC_ISSUER : undefined,
      memo: memo.trim() || undefined,
      msg: msg.trim() || undefined,
    };

    const result = validatePayParams(params);
    if (!result.valid) {
      setError(result.error ?? 'Invalid input.');
      return;
    }

    onGenerate(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* ── Destination ─────────────────────────────── */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="destination"
            className="block font-body text-sm font-medium text-[var(--foreground)]"
          >
            Destination Address <span className="text-[var(--color-secondary)]">*</span>
          </label>
          {destination === walletAddress && walletAddress && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-body text-[10px] font-medium text-green-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Freighter
            </span>
          )}
        </div>
        <input
          id="destination"
          type="text"
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="G..."
          className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)] hover:shadow-[0_0_0_1px_var(--color-primary)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(14,116,144,0.15)] focus:outline-none"
        />
        <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
          The Stellar account that will receive the payment.
        </p>
      </div>

      {/* ── Amount + Asset ──────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="amount"
            className="mb-1.5 block font-body text-sm font-medium text-[var(--foreground)]"
          >
            Amount
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 10.50"
            className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)] hover:shadow-[0_0_0_1px_var(--color-primary)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(14,116,144,0.15)] focus:outline-none"
          />
          <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
            Leave blank for donation mode.
          </p>
        </div>
        <div>
          <label
            htmlFor="asset"
            className="mb-1.5 block font-body text-sm font-medium text-[var(--foreground)]"
          >
            Asset
          </label>
          <div className="relative">
            <select
              id="asset"
              value={asset}
              onChange={(e) => setAsset(e.target.value as 'XLM' | 'USDC')}
              className="input-field appearance-none pr-10"
            >
              <option value="XLM">XLM (native)</option>
              <option value="USDC">USDC</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
            {asset === 'USDC'
              ? `Issuer: ${USDC_ISSUER.slice(0, 8)}...`
              : 'Native Stellar asset.'}
          </p>
        </div>
      </div>

      {/* ── Memo ───────────────────────────────────── */}
      <div>
        <label
          htmlFor="memo"
          className="mb-1.5 block font-body text-sm font-medium text-[var(--foreground)]"
        >
          Memo
          <span className="ml-1 font-normal text-[var(--color-muted-fg)]">(optional)</span>
        </label>
        <input
          id="memo"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="e.g. Donation, Invoice #123"
          className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)] hover:shadow-[0_0_0_1px_var(--color-primary)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(14,116,144,0.15)] focus:outline-none"
        />
        <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
          Attached to the transaction (MEMO_TEXT).
        </p>
      </div>

      {/* ── Message ─────────────────────────────────── */}
      <div>
        <label
          htmlFor="msg"
          className="mb-1.5 block font-body text-sm font-medium text-[var(--foreground)]"
        >
          Message
          <span className="ml-1 font-normal text-[var(--color-muted-fg)]">(optional)</span>
        </label>
        <input
          id="msg"
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="e.g. Thank you for your support!"
          maxLength={300}
          className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)] hover:shadow-[0_0_0_1px_var(--color-primary)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(14,116,144,0.15)] focus:outline-none"
        />
        <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
          Shown in the wallet (max 300 chars, not stored on-chain).
        </p>
      </div>

      {/* ── Error ───────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700"
        >
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ── Submit ──────────────────────────────────── */}
      <button
        type="submit"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] active:scale-[0.98] active:shadow-none"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Generate QR Code
      </button>
    </form>
  );
}
