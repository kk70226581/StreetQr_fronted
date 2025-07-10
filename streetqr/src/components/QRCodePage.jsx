import React, { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function QRCodePage() {
  const shopId = localStorage.getItem("qr_id"); // ✅ Fixed ID for QR generation
  const [qrReady, setQrReady] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    if (shopId) {
      setTimeout(() => setQrReady(true), 500); // Optional delay
    }
  }, [shopId]);

  if (!shopId) {
    return (
      <div className="text-center mt-10 text-red-500 font-bold text-xl">
        ❌ No menu/shop ID found to generate QR code.
      </div>
    );
  }

  const url = `${window.location.origin}/menu/${shopId}`; // ✅ Permanent QR URL

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "streetqr-menu.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-emerald-800 underline">📱 Your Menu QR Code</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
        {qrReady && (
          <>
            <QRCodeCanvas
              id="qr-code"
              value={url}
              size={256}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
              ref={qrRef}
            />

            <p className="mt-4 text-blue-600 underline text-sm text-center break-all">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </p>
          </>
        )}
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
      >
        ⬇️ Download QR Code
      </button>
    </div>
  );
}

export default QRCodePage;
