import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = ["Breakfast", "Lunch", "Brunch", "Dinner"];

function MenuBuilder() {
  const [items, setItems] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shopId, setShopId] = useState("");
  const navigate = useNavigate();

  // ✅ Login and fetch existing menu
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/menu/login', { email, password });
      if (res.data.success) {
        setShopId(res.data.shopId);

        const loadedItems = [];
        for (const cat in res.data.data) {
          res.data.data[cat].forEach(item => {
            loadedItems.push({ ...item, category: cat });
          });
        }

        setItems(loadedItems);
        setIsLoggedIn(true);
      } else {
        alert("❌ Invalid credentials.");
      }
    } catch (err) {
      alert("❌ Login error");
      console.error("Login error:", err);
    }
  };

  // ✅ Add/Edit/Remove Items
  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: "", remarks: "", category: "Breakfast" }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // ✅ Submit Menu
  const handleSubmit = async () => {
    if (items.length === 0) {
      alert("Please add at least one item before submitting.");
      return;
    }

    const groupedData = {};
    items.forEach(item => {
      if (!groupedData[item.category]) groupedData[item.category] = [];
      groupedData[item.category].push({
        name: item.name,
        price: item.price,
        remarks: item.remarks
      });
    });

    try {
      const res = await axios.post(`http://localhost:5000/api/menu/${shopId}`, {
        email,
        password,
        items: groupedData
      });

      alert("✅ Menu submitted successfully!");
      navigate(`/qrcode`, { state: { id: res.data.menu._id } });
    } catch (err) {
      alert("❌ Failed to submit menu");
      console.error("Submit error:", err);
    }
  };

  // ✅ Login Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-lime-100 via-white to-green-200 p-6">
        <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">🔐 Shopkeeper Login / Signup</h2>
          <input
            type="email"
            placeholder="Enter Email"
            className="mb-4 block w-full border border-emerald-300 rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            className="mb-4 block w-full border border-emerald-300 rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            🔐 Login / Signup
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main Menu Builder Page
  return (
    <div className="min-h-screen bg-gradient-to-tr from-lime-100 via-white to-green-200 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-center text-emerald-700 mb-10 underline decoration-emerald-400">🍽️ Customize Your Menu</h1>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border-l-4 border-emerald-400 p-6 mb-6 rounded-lg shadow-md"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-700">Category</label>
                  <select
                    value={item.category}
                    onChange={(e) => handleChange(idx, "category", e.target.value)}
                    className="mt-1 block w-full border border-emerald-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-700">Item Name</label>
                  <input
                    value={item.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    placeholder="e.g., Hotdog Sandwich"
                    className="mt-1 block w-full border border-emerald-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-700">Price (₹)</label>
                  <input
                    value={item.price}
                    onChange={(e) => handleChange(idx, "price", e.target.value)}
                    placeholder="e.g., 40"
                    className="mt-1 block w-full border border-emerald-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-700">Remarks</label>
                  <input
                    value={item.remarks}
                    onChange={(e) => handleChange(idx, "remarks", e.target.value)}
                    placeholder="e.g., Spicy"
                    className="mt-1 block w-full border border-emerald-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="mt-4 text-sm text-red-500 hover:text-red-700"
              >
                ❌ Remove
              </button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <button
              onClick={addItem}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            >
              ➕ Add More Item
            </button>
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            >
              🚀 Submit Menu
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center underline decoration-lime-400">📋 Live Menu Preview</h2>
          {items.length === 0 ? (
            <p className="text-gray-500 italic">No items added yet.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="border border-lime-300 bg-lime-50 rounded-lg p-4">
                  <p className="text-lg font-semibold text-emerald-800">{item.name} <span className="text-sm text-gray-600">({item.category})</span></p>
                  <p className="text-sm text-gray-700">₹{item.price}</p>
                  {item.remarks && <p className="text-sm italic text-gray-500">{item.remarks}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuBuilder;
