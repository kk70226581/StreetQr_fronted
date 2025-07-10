


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ MenuBuilder.jsx (Shopkeeper Menu + Orders)
const API_BASE_URL = 'https://streetqr-backend.onrender.com'; // ✅ Deployed backend URL
const BASE = process.env.REACT_APP_API_BASE || 'https://streetqr-backend.onrender.com';



const categories = ["Breakfast", "Lunch", "Brunch", "Dinner"];

function MenuBuilder() {
  const [items, setItems] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [shopId, setShopId] = useState(localStorage.getItem("shopId") || "");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
 const [shopName, setShopName] = useState(localStorage.getItem("shopName") || '');
const [openHours, setOpenHours] = useState(localStorage.getItem("openHours") || '');
const [address, setAddress] = useState(localStorage.getItem("address") || '');

const [pendingOrders, setPendingOrders] = useState([]);
const [completedOrders, setCompletedOrders] = useState([]);



  useEffect(() => {
    if (isLoggedIn && shopId) {
      loadMenu(shopId);
      fetchOrders(shopId);
    }
  }, [isLoggedIn, shopId]);



const loadMenu = async (id) => {
  try {
    const res = await axios.get(`${BASE}/api/menu/${id}`);
    if (res.data.success) {
      const loadedItems = [];
      for (const cat in res.data.menu) {
        res.data.menu[cat].forEach(item => {
          loadedItems.push({ ...item, category: cat });
        });
      }
      setItems(loadedItems);

      // ✅ Load shop details
      setShopName(res.data.shopName || '');
      setOpenHours(res.data.openHours || '');
      setAddress(res.data.address || '');

      // Save to localStorage so QR and reloads have this too
      localStorage.setItem("shopName", res.data.shopName || '');
      localStorage.setItem("openHours", res.data.openHours || '');
      localStorage.setItem("address", res.data.address || '');
    }
  } catch (err) {
    alert("Failed to load menu.");
  }
};





const fetchOrders = async (id) => {
  try {
   const res = await axios.get(`${BASE}/api/orders/${id}`);

    if (res.data.success) {
      const allOrders = res.data.orders;
      setPendingOrders(allOrders.filter(o => o.status !== 'completed'));
      setCompletedOrders(allOrders.filter(o => o.status === 'completed'));
    }
  } catch (err) {
    console.error("Failed to fetch orders.");
  }
};



const markCompleted = async (orderId) => {
  try {
    const res = await axios.put(`${BASE}/api/order-status/${orderId}`, {
      status: "completed"
    });
    if (res.data.success) {
      alert("Marked as completed");
      fetchOrders(shopId); // Refresh order lists
    }
  } catch (err) {
    console.error(err);
    alert("Failed to mark as completed");
  }
};



  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter both email and password.");
      return;
    }
    try {
      const res = await axios.post(`${BASE}/api/login`, { email, password });


    
      if (res.data.success) {
        setIsLoggedIn(true);
        setShopId(res.data.userId);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("shopId", res.data.userId);
        localStorage.setItem("email", email);
        loadMenu(res.data.userId);
        fetchOrders(res.data.userId);
        alert("Logged in successfully.");
      } else {
        alert("Login failed.");
      }
    } catch (err) {
      alert("Login error.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setItems([]);
    setOrders([]);
    setEmail("");
    setPassword("");
    setShopId("");
    navigate("/");
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: "", remarks: "", category: "Breakfast", image: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };


const handleSubmit = async () => {
  if (items.length === 0) {
    alert("Add at least one item.");
    return;
  }

  const groupedData = {};
  items.forEach(item => {
    if (!groupedData[item.category]) groupedData[item.category] = [];
    groupedData[item.category].push({
      name: item.name,
      price: item.price,
      remarks: item.remarks,
      image: item.image
    });
  });

  try {
    const res = await axios.post(`${BASE}/api/menu/${shopId}`, {
      menu: groupedData,
      shopName,
      openHours,
      address
    });

    if (res.data.success) {
  alert("Menu updated successfully.");
  localStorage.setItem("qr_id", shopId); // ✅ Add this line
  navigate("/qrcode"); // Don't pass via state anymore
}
 else {
      alert("Failed to submit menu.");
    }
  } catch (err) {
    alert("Menu save failed.");
  }
};




  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-lime-100 via-white to-green-200 p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">🔐 Shopkeeper Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border border-emerald-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 border border-emerald-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded"
          >
            🔓 Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-white to-lime-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-700">🍽️ Create Your Menu</h1>



          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            🔓 Logout
          </button>
        </div>


        



<input
  type="text"
  placeholder="Shop Name"
  value={shopName}
  onChange={(e) => {
    setShopName(e.target.value);
    localStorage.setItem("shopName", e.target.value); // ✅ save
  }}
  className="border p-2 rounded border-emerald-300 mb-2 w-full"
/>

<input
  type="text"
  placeholder="Open Hours (e.g. 9 AM - 10 PM)"
  value={openHours}
  onChange={(e) => {
    setOpenHours(e.target.value);
    localStorage.setItem("openHours", e.target.value); // ✅ save
  }}
  className="border p-2 rounded border-emerald-300 mb-2 w-full"
/>

<input
  type="text"
  placeholder="Address (optional)"
  value={address}
  onChange={(e) => {
    setAddress(e.target.value);
    localStorage.setItem("address", e.target.value); // ✅ save
  }}
  className="border p-2 rounded border-emerald-300 mb-2 w-full"
/>









        {items.map((item, idx) => (
          <div key={idx} className="border-l-4 border-emerald-400 p-4 mb-4 rounded bg-gray-50 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 
             

              <input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                className="border p-2 rounded border-emerald-300"
              />
              <input
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleChange(idx, "price", e.target.value)}
                className="border p-2 rounded border-emerald-300"
              />
              <input
                placeholder="Remarks"
                value={item.remarks}
                onChange={(e) => handleChange(idx, "remarks", e.target.value)}
                className="border p-2 rounded border-emerald-300"
              />
              <select
                value={item.category}
                onChange={(e) => handleChange(idx, "category", e.target.value)}
                className="border p-2 rounded border-emerald-300"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                placeholder="Image URL (optional)"
                value={item.image || ''}
                onChange={(e) => handleChange(idx, "image", e.target.value)}
                className="border p-2 rounded border-emerald-300 col-span-1 md:col-span-2"
              />
            </div>
            <button
              onClick={() => removeItem(idx)}
              className="text-red-600 text-sm mt-2 hover:underline"
            >
              ❌ Remove Item
            </button>
          </div>
        ))}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={addItem}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            ➕ Add Item
          </button>
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
          >
            🚀 Submit Menu
          </button>
        </div>

       <div className="mt-12">
  <h2 className="text-2xl font-bold text-emerald-800 mb-4">📦 Current Orders</h2>
  {pendingOrders.length === 0 ? (
    <p className="text-gray-500 italic">No pending orders.</p>
  ) : (
    <ul className="space-y-4">
      {pendingOrders.map(order => (
        <li key={order._id} className="bg-gray-50 border rounded-lg p-4 shadow">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Table:</strong> {order.tableNumber}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <ul className="ml-4 text-sm list-disc">
            {order.items.map((i, idx) => (
              <li key={idx}>{i.name} - ₹{i.price}</li>
            ))}
          </ul>
          <button
            onClick={() => markCompleted(order._id)}
            className="mt-3 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ Mark as Completed
          </button>
        </li>
      ))}
    </ul>
  )}
</div>

<div className="mt-12">
  <h2 className="text-2xl font-bold text-gray-700 mb-4">📜 Order History</h2>
  {completedOrders.length === 0 ? (
    <p className="text-gray-400 italic">No completed orders.</p>
  ) : (
    <ul className="space-y-4">
      {completedOrders.map(order => (
        <li key={order._id} className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Table:</strong> {order.tableNumber}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
        </li>
      ))}
    </ul>
  )}
</div>





      </div>
    </div>
  );
}

export default MenuBuilder;
