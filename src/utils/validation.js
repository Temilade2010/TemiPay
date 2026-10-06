/**
 * Validates a Nigerian phone number (11 digits starting with 070, 080, 081, 090, 091, 071)
 */
export function validateNigerianPhone(phone) {
  if (!phone) return { valid: false, message: 'Phone number is required' };
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 11) {
    return { valid: false, message: 'Phone number must be exactly 11 digits' };
  }
  const prefixes = ['070', '080', '081', '090', '091', '071', '082', '085', '092'];
  const prefix = cleaned.substring(0, 3);
  if (!prefixes.includes(prefix)) {
    return { valid: false, message: 'Invalid Nigerian mobile network prefix' };
  }
  return { valid: true };
}

/**
 * Validates 10-digit NUBAN Nigerian Bank Account number
 */
export function validateNuban(accountNumber) {
  if (!accountNumber) return { valid: false, message: 'Account number is required' };
  const cleaned = accountNumber.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    return { valid: false, message: 'Account number must be 10 digits' };
  }
  return { valid: true };
}

/**
 * Validates transaction PIN (4 digits)
 */
export function validatePin(pin) {
  if (!pin) return { valid: false, message: 'PIN is required' };
  if (!/^\d{4}$/.test(pin)) {
    return { valid: false, message: 'PIN must be exactly 4 digits' };
  }
  return { valid: true };
}

/**
 * Validates OTP code (6 digits)
 */
export function validateOtp(otp) {
  if (!otp) return { valid: false, message: 'OTP is required' };
  if (!/^\d{6}$/.test(otp)) {
    return { valid: false, message: 'OTP must be 6 digits' };
  }
  return { valid: true };
}

/**
 * Validates transfer or purchase amount
 */
export function validateAmount(amount, userBalance, min = 50, max = 5000000) {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: 'Enter a valid amount' };
  }
  if (num < min) {
    return { valid: false, message: `Minimum amount is ₦${min.toLocaleString()}` };
  }
  if (num > max) {
    return { valid: false, message: `Maximum transfer limit is ₦${max.toLocaleString()}` };
  }
  if (num > userBalance) {
    return { valid: false, message: 'Insufficient wallet balance' };
  }
  return { valid: true };
}
