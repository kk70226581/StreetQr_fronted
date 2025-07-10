// ✅ App.js — Full Router Setup

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginSignup from './components/LoginSignup';
import MenuBuilder from './components/MenuBuilder';
import QRCodePage from './components/QRCodePage';
import MenuView from './components/MenuView';
import OrderSummary from './components/OrderSummary';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* 👤 Login/Signup */}
        <Route path="/" element={<LoginSignup setUser={setUser} />} />

        {/* 🍽️ Shopkeeper Menu Builder */}
        <Route path="/menu" element={<MenuBuilder user={user} />} />

        {/* 📱 QR Code Generator */}
        <Route path="/qrcode" element={<QRCodePage />} />

        {/* 🌐 QR Public Menu View */}
        <Route path="/menu/:id" element={<MenuView />} />

        {/* ✅ Customer Order Summary */}
        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
