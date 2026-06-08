# SEP-7 Printable Payment QR Generator

A web app that turns any Stellar payment request into a **print-ready SEP-7 QR code** — designed for newspapers, posters, church bulletins, and any static medium that needs to bridge to digital payments.

**Track:** Financial Inclusion & Everyday Payments (Track 2)

---

## The Problem

In the Philippines, hundreds of churches, community organizations, and small businesses still rely on **cash donations and over-the-counter payments** — even as digital wallets gain adoption. Print media (church bulletins, newspaper ads, posters) can announce a donation drive or payment due, but there's no way to act on it. Readers have to manually type a long wallet address — error-prone and cumbersome.

**70% of Filipinos are underbanked or unbanked.** Many own a basic smartphone but haven't adopted a digital wallet. A QR code in a printed bulletin or poster is the simplest possible on-ramp: scan with any camera, see the address, send a payment.

## The Solution

A **SEP-7 URI** (`web+stellar:pay?destination=G...&amount=...`) is the standardized way to encode a payment request on Stellar. This generator:

1. Takes a destination address, amount, asset (XLM/USDC), memo, and message
2. Builds a valid SEP-7 URI
3. Renders it as a high-contrast QR code optimised for print
4. Provides a clean **print layout** — no form UI, just the QR + payment details
5. Offers a **Simple QR mode** (raw Stellar address only) for universal scanner compatibility, plus a **Full QR mode** (SEP-7 URI) for compatible wallets

## How Stellar Is Used

| Primitive | Usage |
|-----------|-------|
| **SEP-7 URI** | The core standard — `web+stellar:pay` encodes destination, amount, asset, memo, and message in a single scannable link |
| **Stellar accounts (G...)** | Any valid Stellar account can be a payment destination |
| **Asset issuers** | Supports native XLM and USDC (Circle Mainnet issuer) with proper issuer validation |
| **Freighter wallet** | Optional Freighter integration — connect your wallet to auto-fill the destination address |
| **Testnet / Mainnet** | QR codes work on both networks — the receiver's address determines the network |

No Soroban contracts are needed — SEP-7 URIs are pure URL construction, making this lightweight and dependency-free.

## Network Details

The tool itself is network-agnostic. The SEP-7 URI encodes whatever address the user enters:

| Network | USDC Issuer |
|---------|-------------|
| **Mainnet** | `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN` (Circle) |
| **Testnet** | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` |

## Features

- **SEP-7 compliant** — generates valid `web+stellar:pay` URIs
- **XLM or USDC** with correct asset issuer
- **Donation mode** — leave amount blank to let the payer decide
- **Printable layout** — clean, minimal QR for newspapers, posters, bulletins
- **Copy address** — one-click copy of the raw G... address for pasting into any wallet
- **Simple QR / Full QR toggle** — address-only for universal scanners, SEP-7 URI for compatible wallets
- **Freighter wallet integration** — connect to auto-fill your address
- **Share via Web Share API** — send the URI from mobile browsers
- **Fullscreen mode** — enlarge the QR for easy scanning from another device
- **No Stellar SDK required** — pure URL construction

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [qrcode](https://www.npmjs.com/package/qrcode) — canvas-based QR rendering
- [@stellar/freighter-api](https://github.com/stellar/freighter) — optional wallet connection

## Getting Started

### Prerequisites

- **Node.js 18+** (recommended: Node.js 20+)
- **npm** (comes with Node.js)
- A modern web browser
- (Optional) [Freighter wallet extension](https://freighter.app) for wallet auto-fill

### Install & Run

```bash
# Clone the repository
git clone https://github.com/mjmagno22/Project-1-SEP-7-Printable-Payment-QR-Generator.git
cd Project-1-SEP-7-Printable-Payment-QR-Generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Usage

1. **Enter a destination address** — any valid Stellar G... address
2. **(Optional) Set amount and asset** — XLM (native) or USDC; leave blank for donation mode
3. **(Optional) Add a memo** — e.g., "Donation — StellarX PH"
4. **(Optional) Add a message** — shown in the wallet (max 300 chars, not on-chain)
5. Click **Generate QR Code**
6. **Copy the address** and paste into your wallet, or **scan the QR** from another device

### For Print

1. Generate your QR
2. Click **Print QR Code** (opens browser print dialog)
3. The print layout shows only the QR + payment details — no form or UI chrome
4. Readers scan the QR with any Stellar wallet

## Project Structure

```
src/
├── hooks/
│   └── useFreighter.ts       # Freighter wallet connection hook
├── lib/
│   └── sep7.ts               # SEP-7 URI builder & validation
├── components/
│   ├── QrForm.tsx            # Payment detail form
│   ├── QrDisplay.tsx         # QR code display + copy/share/download
│   ├── FreighterConnect.tsx  # Wallet connect/disconnect button
│   └── PrintLayout.tsx       # Print-optimised layout
└── app/
    ├── globals.css           # Tailwind v4 + design tokens
    ├── layout.tsx            # Root layout
    └── page.tsx              # Main page (form + preview + how-to)
```

## SEP-7 Reference

| Resource | URL |
|----------|-----|
| SEP-7 Spec | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md |
| Mainnet USDC Issuer (Circle) | `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN` |
| Testnet USDC Issuer | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` |
| Stellar Laboratory | https://laboratory.stellar.org |
| Freighter Wallet | https://freighter.app |

## Team

- **Mark Jason R. Magno** — [mjmagno22](https://github.com/mjmagno22) (solo entry)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
