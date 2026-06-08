# SEP-7 Printable Payment QR Generator

**Problem:** Newspapers, posters, and church bulletins can't carry a "pay/donate here" action — print is static.

**Solution:** A generator that turns any payment or donation request into a SEP-7 URI rendered as a printable QR code.

**Why Stellar:** SEP-7 is the standardized payment-request URI scheme — any Stellar wallet can parse it.

---

## Features

- **SEP-7 compliant** — generates `web+stellar:pay?destination=G...&amount=...` URIs
- **XLM or USDC** support with proper asset issuer
- **Printable layout** — clean, minimal QR for newspapers, posters, bulletins
- **Donation mode** — leave amount blank to let the payer decide
- **Copy URI** button for digital sharing
- No Stellar SDK needed — pure URL construction

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind v4
- [qrcode](https://www.npmjs.com/package/qrcode) — canvas-based QR rendering

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Print Workflow

1. Fill in the payment details (destination, amount, asset, memo)
2. Click **"Print QR Code"** — opens the browser print dialog
3. The print layout shows only the QR + details (no form/UI chrome)
4. Readers scan the QR with [Freighter](https://freighter.app) or any Stellar wallet — the SEP-7 URI auto-fills the payment

## SEP-7 Reference

| Resource | URL |
|---|---|
| SEP-7 Spec | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md |
| Testnet USDC Issuer | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` |
| Stellar Laboratory | https://laboratory.stellar.org |
