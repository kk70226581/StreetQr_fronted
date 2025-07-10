import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const translations = {
  en: {
    menu: "Menu",
    yourOrder: "Your Order",
    name: "Customer Name",
    table: "Table Number",
    noItems: "No items selected.",
    total: "Total",
    checkout: "Checkout Order"
  },
  hi: {
    menu: "मेनू",
    yourOrder: "आपका ऑर्डर",
    name: "ग्राहक का नाम",
    table: "टेबल नंबर",
    noItems: "कोई आइटम चयनित नहीं है।",
    total: "कुल",
    checkout: "ऑर्डर करें"
  }
};

function MenuView() {
  const { id } = useParams(); // shopId
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [lang, setLang] = useState('en');
  const [shop, setShop] = useState({});


  const t = translations[lang];

  useEffect(() => {
    axios.get(`https://streetqr-backend.onrender.com/api/menu/${id}`)
  .then(res => {
    if (res.data.success) {
      setMenuData(res.data.menu);
      setShop({
        logo: res.data.logo,
        shopName: res.data.shopName,
        openHours: res.data.openHours,
        address: res.data.address
      });
    }
  });

  }, [id]);

  const handleSelect = (item, isChecked) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    } else {
      setSelectedItems(prev => prev.filter(i => i.name !== item.name));
    }
  };

  const updateQuantity = (itemName, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedItems(prev =>
      prev.map(item =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const isItemSelected = (itemName) => selectedItems.some(item => item.name === itemName);
  const getItemQuantity = (itemName) => selectedItems.find(item => item.name === itemName)?.quantity || 1;

  const getTotal = () =>
    selectedItems.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0);

  const handleCheckout = async () => {
    if (!customerName || !tableNumber || selectedItems.length === 0) {
      alert("Please enter all details and select items.");
      return;
    }
    const orderPayload = {
      shopId: id,
      customerName,
      tableNumber,
      items: selectedItems,
      total: getTotal()
    };
    try {
      const res = await axios.post("https://streetqr-backend.onrender.com/api/order", orderPayload);
      if (res.data.success) {
        navigate("/order-summary", {
          state: { ...orderPayload, orderId: res.data.orderId }
        });
      }
    } catch {
      alert("Order failed.");
    }
  };

  if (!menuData) return <p className="text-center mt-10 text-red-500">Loading or menu not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lime-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">



{/* ✅ Shop Info Section */}
<div className="flex flex-col sm:flex-row items-center justify-between mb-6">
  <div className="flex items-center gap-4 mb-4 sm:mb-0">
    {shop.logo && (
      <img
        src={shop.logo}
        alt="Shop Logo"
        className="h-16 w-16 rounded-full border shadow"
      />
    )}
    <div>
     <h1 ><h2 className="text-xl font-bold text-emerald-800">{shop.shopName || "Shop Name"}</h2></h1>
    <h5> Opens At <p className="text-sm text-gray-500">{shop.openHours || "Open Hours not available"}</p> </h5>
      <p className="text-sm text-gray-600">{shop.address || "Address not available"}</p>
    </div>
  </div>
</div>



        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700">📋 {t.menu}</h1>
          <br></br>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="border px-2 py-1 rounded">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        {Object.entries(menuData).map(([category, items]) => (
          <div key={category} className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-emerald-600 border-b mb-2">{category}</h2>
            {items.map((item) => (
              <label
                key={item.name}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-lime-50 hover:bg-lime-100 border border-emerald-200 rounded-lg p-4 mb-2 transition"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="text-lg font-semibold">
                    {lang === 'hi' && item.name_hi ? item.name_hi : item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} {item.remarks && `• ${item.remarks}`}
                  </p>
       {item.image && (
  <div className="mt-2">
    <img
    
  src={item.image}
  alt={item.name}
  style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
/>

  
  </div>
)}

                </div>
                <div className="flex items-center gap-2">
                  {isItemSelected(item.name) && (
                    <div className="flex items-center border border-emerald-300 rounded-md">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.name, getItemQuantity(item.name) - 1);
                        }}
                        className="px-2 py-1 text-emerald-700 hover:bg-emerald-100"
                      >
                        -
                      </button>
                      <span className="px-2 text-emerald-800">{getItemQuantity(item.name)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.name, getItemQuantity(item.name) + 1);
                        }}
                        className="px-2 py-1 text-emerald-700 hover:bg-emerald-100"
                      >
                        +
                      </button>
                    </div>
                  )}
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-emerald-600"
                    checked={isItemSelected(item.name)}
                    onChange={(e) => handleSelect(item, e.target.checked)}
                  />
                </div>
              </label>
            ))}
          </div>
        ))}

        <div className="mt-6 sm:mt-8 border-t pt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-emerald-700 mb-4">🧾 {t.yourOrder}</h3>

          <input
            type="text"
            placeholder={t.name}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="block w-full mb-3 px-4 py-2 border rounded border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="number"
            placeholder={t.table}
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="block w-full mb-4 px-4 py-2 border rounded border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <div className="bg-lime-100 p-4 rounded-lg shadow-inner mb-4">
            {selectedItems.length === 0 ? (
              <p className="text-gray-500 italic">{t.noItems}</p>
            ) : (
              <ul className="space-y-2">
                {selectedItems.map((item) => (
                  <li key={item.name} className="flex justify-between text-emerald-700 font-medium">
                    <span>
                      {lang === 'hi' && item.name_hi ? item.name_hi : item.name}
                      <span className="text-sm text-gray-500 ml-2">(x{item.quantity})</span>
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
            <hr className="my-2" />
            <p className="text-right font-bold text-lg sm:text-xl text-emerald-800">
              {t.total}: ₹{getTotal().toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            ✅ {t.checkout}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuView;
