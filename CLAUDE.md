# SEP-7 QR — Printable Stellar Payment QR Codes

A Next.js 16 app that generates **SEP-7 URI** payment QR codes optimised for
print media — newspapers, posters, church bulletins, and any static medium.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4**
- **qrcode** package (canvas-based QR rendering)
- NO Stellar SDK dependency — SEP-7 URIs are pure URL construction

## Project structure

```
src/
├── lib/
│   └── sep7.ts           # SEP-7 URI builder & validation
├── components/
│   ├── QrForm.tsx        # Payment detail form
│   ├── QrDisplay.tsx     # QR code canvas + URI display
│   └── PrintLayout.tsx   # Print-optimised layout
└── app/
    ├── globals.css       # Tailwind + print media queries
    ├── layout.tsx
    └── page.tsx          # Main page
```

## Key commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

## SEP-7 reference

| Resource | URL |
|---|---|
| SEP-7 spec | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md |
| Testnet USDC issuer | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` |
| Stellar Laboratory | https://laboratory.stellar.org |

## Print workflow

1. Fill in the payment details (destination, amount, asset, memo)
2. Click "Print QR Code" — opens the browser print dialog
3. The print layout shows only the QR + details (no form/UI chrome)
4. Readers scan the QR with Freighter — wallet auto-fills the payment
