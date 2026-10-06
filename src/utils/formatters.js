/**
 * Formats a number to Nigerian Naira currency representation.
 * @param {number|string} amount
 * @param {object} options
 * @returns {string}
 */
export function formatNaira(amount, options = {}) {
  const { showDecimals = true, hidden = false } = options;
  if (hidden) return "₦ ••••••";

  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount) || 0;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);
}

/**
 * Returns formatted compact Naira (e.g. ₦12.5k)
 */
export function formatCompactNaira(amount) {
  const num = Number(amount) || 0;
  if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `₦${(num / 1000).toFixed(1)}k`;
  return `₦${num.toLocaleString()}`;
}

/**
 * Friendly date formatter for fintech transactions
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + ` • ${timeStr}`;
}

/**
 * Clean phone number for Nigerian telcos (080... or +234...)
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    cleaned = '0' + cleaned.slice(3);
  }
  return cleaned;
}

/**
 * Masks account number for security: e.g. 810****234
 */
export function maskAccountNumber(num) {
  if (!num || num.length < 6) return num;
  return num.slice(0, 3) + '****' + num.slice(-3);
}

/**
 * Generates an authentic Nigerian banking transaction reference
 */
export function generateReference(prefix = 'TP') {
  const dateStr = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${dateStr}-${random}`;
}
