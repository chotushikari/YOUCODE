
import QRCode from 'qrcode';

export const generateQRCodeDataURL = async (url) => {
  try {
    const qrDataURL = await QRCode.toDataURL(url, { margin: 0, width: 80 });
    return qrDataURL;
  } catch (err) {
    console.error('QR generation error:', err);
    return null;
  }
};