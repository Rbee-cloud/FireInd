/**
 * Indian Rupee & Financial Formatters
 */

export function formatINR(val: number, showSymbol = true): string {
  if (isNaN(val) || val === null || val === undefined) return showSymbol ? '₹0' : '0';
  const isNegative = val < 0;
  const absVal = Math.round(Math.abs(val));

  // Format with Indian grouping (3 digits at end, then 2 digits)
  const str = absVal.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const prefix = isNegative ? '-₹' : showSymbol ? '₹' : '';
  return `${prefix}${formatted}`;
}

export function formatCrLakh(val: number, precision = 2): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  let formatted = '';
  if (absVal >= 10_000_000) {
    // 1 Crore = 10,000,000
    const cr = absVal / 10_000_000;
    formatted = `${cr.toFixed(precision)} Cr`;
  } else if (absVal >= 100_000) {
    // 1 Lakh = 100,000
    const lk = absVal / 100_000;
    formatted = `${lk.toFixed(precision)} L`;
  } else if (absVal >= 1_000) {
    const k = absVal / 1_000;
    formatted = `${k.toFixed(1)} K`;
  } else {
    formatted = Math.round(absVal).toString();
  }

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatPercent(val: number, precision = 1): string {
  if (isNaN(val)) return '0%';
  return `${val.toFixed(precision)}%`;
}

export function parseIndianNumber(val: string): number {
  if (!val) return 0;
  // Remove currency symbols, commas, spaces
  const clean = val.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}
