'use client';

import { useState } from 'react';
import type { Sep7PayParams, ValidationResult } from '@/lib/sep7';
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

    const result: ValidationResult = validatePayParams(params);
    if (!result.valid) {
      setError(result.error ?? 'Invalid input.');
      return;
    }

    onGenerate(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Destination */}
      <div>
        <label
          htmlFor="destination"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Destination Address <span className="text-red-500">*</span>
        </label>
        <input
          id="destination"
          type="text"
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="G..."
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          The Stellar account that will receive the payment.
        </p>
      </div>

      {/* Amount & Asset */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="amount"
            className="mb-1 block text-sm font-medium text-gray-700"
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
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave blank to let the payer enter the amount.
          </p>
        </div>
        <div>
          <label
            htmlFor="asset"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Asset
          </label>
          <select
            id="asset"
            value={asset}
            onChange={(e) => setAsset(e.target.value as 'XLM' | 'USDC')}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="XLM">XLM (native)</option>
            <option value="USDC">USDC</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {asset === 'USDC'
              ? `Issuer: ${USDC_ISSUER.slice(0, 8)}...`
              : 'Native Stellar asset.'}
          </p>
        </div>
      </div>

      {/* Memo */}
      <div>
        <label
          htmlFor="memo"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Memo <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <input
          id="memo"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="e.g. Donation, Invoice #123"
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          Attached to the transaction (MEMO_TEXT).
        </p>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="msg"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Message <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <input
          id="msg"
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="e.g. Thank you for your support!"
          maxLength={300}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          Shown in the wallet (max 300 chars, not stored on-chain).
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:bg-indigo-700"
      >
        Generate QR Code
      </button>
    </form>
  );
}
