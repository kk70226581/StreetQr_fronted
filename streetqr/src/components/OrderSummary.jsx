import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, customerName, tableNumber, items, total, logo } = state || {};

  if (!orderId) {
    return <p className="text-center mt-10 text-red-600">❌ No order found.</p>;
  }

  const generateInvoice = async () => {
    const doc = new jsPDF();
    const orderTime = new Date().toLocaleString();

    const fillText = () => {
      doc.setFontSize(16);
      doc.text("StreetQR - Order Invoice", 20, 20);

      doc.setFontSize(12);
      doc.text(`Order ID: ${orderId}`, 20, 35);
      doc.text(`Customer: ${customerName}`, 20, 43);
      doc.text(`Table No: ${tableNumber}`, 20, 51);
      doc.text(`Date: ${orderTime}`, 20, 59);

      let y = 70;
      doc.setFontSize(14);
      doc.text("Items", 20, y);
      y += 10;

      items.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`,
          20,
          y
        );
        y += 10;
      });

      y += 5;
      doc.setFontSize(14);
      doc.text(`Total: ₹${total}`, 20, y);

      doc.save(`Invoice_${orderId}.pdf`);
    };

    try {
      if (logo) {
        const imageBlob = await fetch(logo).then(r => r.blob());
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          doc.addImage(base64data, 'PNG', 150, 10, 40, 20); // Optional: Adjust position
          fillText();
        };
        reader.readAsDataURL(imageBlob);
      } else {
        fillText();
      }
    } catch (err) {
      console.error("⚠️ Logo load error:", err.message);
      fillText();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lime-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-emerald-700 mb-6">✅ Order Confirmed</h1>

        <div className="text-lg mb-4">
          <p><strong>📟 Order ID:</strong> #{orderId}</p>
          <p><strong>🧑 Customer:</strong> {customerName}</p>
          <p><strong>🏦 Table:</strong> {tableNumber}</p>
        </div>

        <div className="bg-lime-50 p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold text-emerald-700 mb-2">🧹 Ordered Items:</h3>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <hr className="my-2" />
          <p className="text-right font-bold text-lg text-emerald-800">Total: ₹{total}</p>
        </div>

        <div className="text-center flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <button
            onClick={() => alert("💳 Payment gateway integration coming soon...")}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            💳 Pay Online
          </button>

          <button
            onClick={generateInvoice}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            🧾 Download Invoice
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
          >
            🔙 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
