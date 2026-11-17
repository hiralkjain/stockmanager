/**
 * Formats a number as a USD currency string.
 */
export function formatCurrency(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number with standard commas.
 */
export function formatNumber(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a percentage with explicit +/- sign.
 */
export function formatPercent(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Formats large market values into compact notation (e.g. 2.45T, 850.2B, 12.4M).
 */
export function formatCompactNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats an ISO date string to a clean human-readable date.
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Returns Tailwind CSS text color class for financial gain/loss values.
 */
export function getGainLossColor(value: number | undefined | null): string {
  if (value === undefined || value === null || value === 0) return 'text-slate-600';
  return value > 0 ? 'text-emerald-600' : 'text-rose-600';
}

/**
 * Returns Tailwind CSS background/badge classes for financial gain/loss values.
 */
export function getGainLossBadgeClass(value: number | undefined | null): string {
  if (value === undefined || value === null || value === 0) {
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }
  return value > 0
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';
}
