/**
 * Utility to generate and download a high-resolution Nigerian bank e-receipt
 * as a PNG image using the HTML5 Canvas API.
 */
export function generateReceiptImage(data) {
  const canvas = document.createElement('canvas');
  const width = 640;
  const height = 920;
  const scale = 2; // High DPI

  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Top Accent Gradient Banner
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#00875A');
  gradient.addColorStop(1, '#0D9488');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 120);

  // TemiPay Logo & Brand Mark
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(60, 60, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#00875A';
  ctx.font = 'bold 20px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TP', 60, 67);

  // Header Titles
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('TemiPay', 104, 54);

  ctx.fillStyle = '#E6F4EA';
  ctx.font = '500 12px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('TRANSACTION RECEIPT • BEYOND BANKING', 104, 76);

  // Status Badge Pill
  ctx.fillStyle = '#ECFDF5';
  ctx.beginPath();
  ctx.roundRect(width - 170, 42, 130, 36, 18);
  ctx.fill();

  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#065F46';
  ctx.font = 'bold 12px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ SUCCESSFUL', width - 105, 65);

  // Amount Box Card
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.roundRect(40, 140, width - 80, 110, 20);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '600 12px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRANSACTION AMOUNT', width / 2, 172);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 36px "Plus Jakarta Sans", Inter, sans-serif';
  const formattedAmount = `₦${Math.abs(Number(data.amount) || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  ctx.fillText(formattedAmount, width / 2, 218);

  // Receipt Table Fields
  const rows = [
    { label: 'Transaction Type', value: data.type || 'Interbank Transfer' },
    { label: 'Sender Name', value: (data.senderName || 'TEMITOPE ADEBAYO').toUpperCase() },
    { label: 'Sender Bank', value: 'TemiPay MFB' },
    { label: 'Sender Account', value: data.senderAccount || '8123456789' },
    { label: 'Recipient Name', value: (data.recipient || data.recipientName || 'BENEFICIARY').toUpperCase() },
    { label: 'Recipient Bank', value: data.bank || 'Commercial Bank' },
    { label: 'Recipient Account', value: data.accountNumber || '0123456789' },
    { label: 'Narration / Remark', value: data.narration || 'TemiPay Virtual Money Transfer' },
    { label: 'Transaction Fee', value: '₦0.00 (Free)' },
    { label: 'Transaction Date', value: data.date || new Date().toLocaleString('en-GB') },
    { label: 'Reference Number', value: data.reference || 'TP-20261006-89104' },
    { label: 'Session ID', value: `999001${Date.now()}89410` },
  ];

  let currentY = 285;
  ctx.textAlign = 'left';

  rows.forEach((row, i) => {
    // Row separator line
    if (i > 0) {
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, currentY - 14);
      ctx.lineTo(width - 40, currentY - 14);
      ctx.stroke();
    }

    // Label
    ctx.fillStyle = '#64748B';
    ctx.font = '500 12px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText(row.label, 45, currentY);

    // Value
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.textAlign = 'right';
    // Truncate long value if needed
    const displayVal = row.value.length > 34 ? row.value.slice(0, 32) + '...' : row.value;
    ctx.fillText(displayVal, width - 45, currentY);
    ctx.textAlign = 'left';

    currentY += 34;
  });

  // Footer Disclaimer & CBN notice
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, height - 100, width, 100);

  ctx.strokeStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.moveTo(0, height - 100);
  ctx.lineTo(width, height - 100);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#00875A';
  ctx.font = 'bold 12px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('TemiPay Digital Services Limited', width / 2, height - 68);

  ctx.fillStyle = '#64748B';
  ctx.font = '400 10px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('Licensed by the Central Bank of Nigeria (CBN). Insured by the NDIC.', width / 2, height - 50);
  ctx.fillText('Generated electronically. No physical signature required.', width / 2, height - 35);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `TemiPay_Receipt_${data.reference || Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
