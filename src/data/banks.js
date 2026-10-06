export const NIGERIAN_BANKS = [
  { id: 'temipay', name: 'TemiPay MFB (Instant & Free)', code: '999001', type: 'Fintech', popular: true, color: '#00A86B' },
  { id: 'opay', name: 'OPay Digital Services', code: '999992', type: 'Fintech', popular: true, color: '#13C296' },
  { id: 'moniepoint', name: 'Moniepoint MFB', code: '50515', type: 'MFB', popular: true, color: '#003366' },
  { id: 'palmpay', name: 'PalmPay Limited', code: '999991', type: 'Fintech', popular: true, color: '#7E22CE' },
  { id: 'kuda', name: 'Kuda Microfinance Bank', code: '50211', type: 'MFB', popular: true, color: '#40196D' },
  { id: 'gtb', name: 'Guaranty Trust Bank (GTBank)', code: '058', type: 'Commercial', popular: true, color: '#E04F16' },
  { id: 'access', name: 'Access Bank', code: '044', type: 'Commercial', popular: true, color: '#0F4C81' },
  { id: 'zenith', name: 'Zenith Bank', code: '057', type: 'Commercial', popular: true, color: '#800000' },
  { id: 'uba', name: 'United Bank for Africa (UBA)', code: '033', type: 'Commercial', popular: true, color: '#D91A1A' },
  { id: 'firstbank', name: 'First Bank of Nigeria', code: '011', type: 'Commercial', popular: true, color: '#0C2340' },
  { id: 'stanbic', name: 'Stanbic IBTC Bank', code: '221', type: 'Commercial', popular: false, color: '#0033A0' },
  { id: 'fcmb', name: 'First City Monument Bank (FCMB)', code: '214', type: 'Commercial', popular: false, color: '#5C2D91' },
  { id: 'fidelity', name: 'Fidelity Bank', code: '070', type: 'Commercial', popular: false, color: '#00704A' },
  { id: 'wema', name: 'Wema Bank / ALAT', code: '035', type: 'Commercial', popular: false, color: '#8F1D5E' },
  { id: 'sterling', name: 'Sterling Bank', code: '232', type: 'Commercial', popular: false, color: '#D6001C' },
  { id: 'union', name: 'Union Bank of Nigeria', code: '032', type: 'Commercial', popular: false, color: '#0075C9' },
  { id: 'polaris', name: 'Polaris Bank', code: '076', type: 'Commercial', popular: false, color: '#6A1A78' },
  { id: 'ecobank', name: 'Ecobank Nigeria', code: '050', type: 'Commercial', popular: false, color: '#00558F' },
  { id: 'rubies', name: 'Rubies MFB', code: '125', type: 'MFB', popular: false, color: '#E11D48' },
  { id: 'vbank', name: 'VFD Microfinance Bank (VBank)', code: '566', type: 'MFB', popular: false, color: '#9333EA' },
];

/**
 * Mock resolution for NUBAN account lookup
 */
export function resolveAccountMock(accountNumber, bankId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (accountNumber.length !== 10) {
        reject(new Error('Invalid account number'));
        return;
      }
      
      const names = [
        'ADEWALE BABATUNDE OLUWASEUN',
        'CHUKWUMA TEMITOPE ADEBAYO',
        'FATIMA HASSAN DANJUMA',
        'BLESSING NGOZI OKAFOR',
        'EMMANUEL CHIBUZOR EZE',
        'ZAINAB BELLO SULAIMAN',
        'OLAWALE TAIWO JOHNSON',
        'PRECIOUS AMARACHI NWOSU'
      ];
      // Deterministic name selection based on last digits
      const lastDigit = parseInt(accountNumber.slice(-1), 10) || 0;
      const resolvedName = names[lastDigit % names.length];
      
      resolve({
        accountNumber,
        accountName: resolvedName,
        bankName: NIGERIAN_BANKS.find(b => b.id === bankId)?.name || 'Commercial Bank',
        bvnVerified: true,
        kycLevel: 'Tier 2'
      });
    }, 650);
  });
}
