import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginSignup({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const userId = localStorage.getItem("shopId");
    if (loggedIn === "true" && userId) {
      navigate("/menu");
    }
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("❗ Please enter both email and password.");
      return;
    }

    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("shopId", res.data.userId);
        localStorage.setItem("email", email);

        setUser({ id: res.data.userId, menu: res.data.menu || {} });

        alert(`${isLogin ? "✅ Login" : "✅ Signup"} successful!`);
        navigate("/menu");
      } else {
        alert("❌ " + res.data.message);
      }
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-lime-200 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
        <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6 tracking-wide">
          {isLogin ? "🔐 Login to your Account" : "📝 Create an Account"}
        </h2>

        <input
          type="email"
          className="w-full mb-4 px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 px-4 py-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-emerald-600 text-white py-2 rounded font-semibold text-lg hover:bg-emerald-700 transition duration-300"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 ml-2 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
