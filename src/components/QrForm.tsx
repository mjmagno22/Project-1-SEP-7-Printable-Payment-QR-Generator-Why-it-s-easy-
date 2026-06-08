'use client';

import { useState } from 'react';
import type { Sep7PayParams } from '@/lib/sep7';
import { validatePayParams } from '@/lib/sep7';

interface QrFormProps {
  onGenerate: (params: Sep7PayParams) => void;
}

/** Default USDC testnet issuer (Circle). */
const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export default function QrForm({ onGenerate }: QrFormProps) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState<'XLM' | 'USDC'>('XLM');
  const [memo, setMemo] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const params: Sep7PayParams = {
      destination: destination.trim(),
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* ── Destination ─────────────────────────────── */}
      <div>
        <label
          htmlFor="destination"
          className="mb-1.5 block font-body text-sm font-medium text-[var(--foreground)]"
        >
          Destination Address <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="destination"
          type="text"
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="G..."
          className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 font-body text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)]"
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
            className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 font-body text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)]"
          />
          <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
            Leave blank to let the payer decide.
          </p>
        </div>
        <div>
          <label
            htmlFor="asset"
            className="mb-1.5 block font-body text-sm font-medium text-[var(--foreground)]"
          >
            Asset
          </label>
          <select
            id="asset"
            value={asset}
            onChange={(e) => setAsset(e.target.value as 'XLM' | 'USDC')}
            className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 font-body text-sm text-[var(--foreground)] transition hover:border-[var(--color-primary)]"
          >
            <option value="XLM">XLM (native)</option>
            <option value="USDC">USDC</option>
          </select>
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
          Memo{' '}
          <span className="text-[var(--color-muted-fg)]">(optional)</span>
        </label>
        <input
          id="memo"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="e.g. Donation, Invoice #123"
          className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 font-body text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)]"
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
          Message{' '}
          <span className="text-[var(--color-muted-fg)]">(optional)</span>
        </label>
        <input
          id="msg"
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="e.g. Thank you for your support!"
          maxLength={300}
          className="block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 font-body text-sm text-[var(--foreground)] placeholder:text-[var(--color-muted-fg)] transition hover:border-[var(--color-primary)]"
        />
        <p className="mt-1.5 font-body text-xs text-[var(--color-muted-fg)]">
          Shown in the wallet (max 300 chars, not stored on-chain).
        </p>
      </div>

      {/* ── Error ───────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* ── Submit ──────────────────────────────────── */}
      <button
        type="submit"
        className="w-full cursor-pointer rounded-lg bg-[var(--color-accent)] px-6 py-3 font-sans text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:opacity-80"
      >
        Generate QR Code
      </button>
    </form>
  );
}
