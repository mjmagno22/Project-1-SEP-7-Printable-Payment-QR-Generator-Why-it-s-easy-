/**
 * SEP-7 URI builder and validator.
 *
 * SEP-7 defines the `web+stellar:pay` URI scheme that any Stellar wallet can
 * parse — making it the standard way to encode a payment request in a QR code
 * for print media, posters, or static web links.
 *
 * Spec: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md
 */

// Stellar account addresses start with G and are 56 characters.
const STELLAR_ADDRESS_RE = /^G[A-Z2-7]{55}$/;

export interface Sep7PayParams {
  /** Stellar account ID (G...) — required. */
  destination: string;
  /** Amount the destination will receive (optional — wallet prompts user if omitted). */
  amount?: string;
  /** Asset code (e.g. "USDC", "XLM"). Omit / "XLM" for native. */
  assetCode?: string;
  /** Issuer account ID — required if assetCode is set and not XLM. */
  assetIssuer?: string;
  /** Memo text (MEMO_TEXT — URL-encoded directly). */
  memo?: string;
  /** Memo type. Defaults to MEMO_TEXT if memo is set. */
  memoType?: 'MEMO_TEXT' | 'MEMO_ID' | 'MEMO_HASH' | 'MEMO_RETURN';
  /** Message shown in wallet (max 300 chars, not on-chain). */
  msg?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Validate a Stellar public key (G...). */
export function validateStellarAddress(address: string): boolean {
  return STELLAR_ADDRESS_RE.test(address);
}

/** Validate SEP-7 pay parameters and return a human-readable error. */
export function validatePayParams(params: Sep7PayParams): ValidationResult {
  if (!params.destination) {
    return { valid: false, error: 'Destination address is required.' };
  }
  if (!validateStellarAddress(params.destination)) {
    return {
      valid: false,
      error:
        'Invalid Stellar address. Must start with G and be 56 characters.',
    };
  }

  if (params.amount !== undefined && params.amount !== '') {
    const n = Number(params.amount);
    if (isNaN(n) || n <= 0) {
      return { valid: false, error: 'Amount must be a positive number.' };
    }
    // Max 7 decimal places (Stellar precision)
    const parts = params.amount.split('.');
    if (parts.length === 2 && parts[1].length > 7) {
      return {
        valid: false,
        error: 'Amount has more than 7 decimal places.',
      };
    }
  }

  if (
    params.assetCode &&
    params.assetCode !== 'XLM' &&
    !params.assetIssuer
  ) {
    return {
      valid: false,
      error: 'Asset issuer is required for non-native assets.',
    };
  }

  if (params.assetIssuer && !validateStellarAddress(params.assetIssuer)) {
    return {
      valid: false,
      error: 'Invalid asset issuer address.',
    };
  }

  if (params.msg && params.msg.length > 300) {
    return { valid: false, error: 'Message must be 300 characters or fewer.' };
  }

  return { valid: true };
}

/**
 * Build a SEP-7 `web+stellar:pay` URI from structured params.
 * Returns the URI string, or an error message if validation fails.
 */
export function buildSep7Uri(params: Sep7PayParams): string {
  const url = new URL('web+stellar:pay');

  url.searchParams.set('destination', params.destination);

  if (params.amount) {
    url.searchParams.set('amount', params.amount);
  }

  if (params.assetCode && params.assetCode !== 'XLM') {
    url.searchParams.set('asset_code', params.assetCode);
    if (params.assetIssuer) {
      url.searchParams.set('asset_issuer', params.assetIssuer);
    }
  }

  if (params.memo) {
    url.searchParams.set('memo', params.memo);
    url.searchParams.set('memo_type', params.memoType ?? 'MEMO_TEXT');
  }

  if (params.msg) {
    url.searchParams.set('msg', params.msg);
  }

  return url.toString();
}

/** Human-readable asset label for display. */
export function assetLabel(code?: string): string {
  return code && code !== 'XLM' ? code : 'XLM';
}
