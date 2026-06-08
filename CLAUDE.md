# SEP-7 QR — Printable Stellar Payment QR Codes

A Next.js 16 app that generates **SEP-7 URI** payment QR codes optimised for
print media — newspapers, posters, church bulletins, and any static medium.

**Hackathon:** StellarX Philippines — Track 2: Financial Inclusion & Everyday Payments

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4**
- **qrcode** package (canvas-based QR rendering)
- **@stellar/freighter-api** — optional wallet connection (auto-fill destination)
- NO full Stellar SDK dependency — SEP-7 URIs are pure URL construction

## Key commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

## Project structure

```
src/
├── hooks/
│   └── useFreighter.ts   # Freighter wallet connection hook
├── lib/
│   └── sep7.ts           # SEP-7 URI builder & validation
├── components/
│   ├── QrForm.tsx        # Payment detail form
│   ├── QrDisplay.tsx     # QR code display + copy/share/download
│   ├── FreighterConnect.tsx  # Wallet connect/disconnect button
│   └── PrintLayout.tsx   # Print-optimised layout
└── app/
    ├── globals.css       # Tailwind + design tokens + print queries
    ├── layout.tsx
    └── page.tsx          # Main page (form + preview + QR toggle + how-to)
```

## Key design decisions

- **Two QR modes**: Simple (raw G... address, scannable by any camera) and Full (SEP-7 URI)
- **Copy Address** button: prominent copy of just the G... address for pasting into Freighter mobile
- **Freighter detection** via `isAllowed()` API call (not `window.freighter`)
- **Smart URI parsing**: if user pastes a full `web+stellar:pay?...` URI into the destination field, extracts the G... address automatically
- **Print layout**: clean, minimal — no form UI, just QR + payment details
