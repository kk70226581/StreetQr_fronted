
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const app = express();
const PORT = 5000;

// ✅ Middleware
const corsOptions = {
  origin: ['https://www.qzaar.shop'], // ✅ Allow your frontend domain
  credentials: true,
};
app.use(cors(corsOptions));


app.use(express.json({ limit: '5mb' }));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Schemas
const shopkeeperSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  menu: { type: Object, default: {} },
  logo: { type: String, default: "" },
  shopName: { type: String, default: "" },
  openHours: { type: String, default: "" },
  address: { type: String, default: "" }
});
const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);

const orderSchema = new mongoose.Schema({
  shopId: String,
  customerName: String,
  tableNumber: String,
  items: Array,
  total: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// 🔐 Signup
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const existing = await Shopkeeper.findOne({ email });
  if (existing) return res.json({ success: false, message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const newUser = await Shopkeeper.create({ email, passwordHash: hash });
  res.json({ success: true, userId: newUser._id });
});

// 🔐 Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Shopkeeper.findOne({ email });
  if (!user) return res.json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.json({ success: false, message: "Wrong password" });

  res.json({ success: true, userId: user._id, menu: user.menu });
});

// 📥 Save Menu + Shop Info
app.post("/api/menu/:userId", async (req, res) => {
  try {
    const user = await Shopkeeper.findById(req.params.userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    user.menu = req.body.menu || {};
    user.shopName = req.body.shopName || "";
    user.openHours = req.body.openHours || "";
    user.address = req.body.address || "";
    user.logo = req.body.logo || "";

    await user.save();
    res.json({ success: true, menu: user.menu, _id: user._id });
  } catch (err) {
    console.error("❌ Menu Save Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📤 Get Menu + Shop Info
app.get("/api/menu/:id", async (req, res) => {
  try {
    const user = await Shopkeeper.findById(req.params.id);
    if (!user) return res.json({ success: false, message: "Shopkeeper not found" });

    res.json({
      success: true,
      menu: user.menu,
      logo: user.logo || "",
      shopName: user.shopName || "",
      openHours: user.openHours || "",
      address: user.address || ""
    });
  } catch (err) {
    console.error("❌ Get Menu Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🧾 Place Order
app.post("/api/order", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🧾 Get Orders
app.get("/api/orders/:shopId", async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.params.shopId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Get Orders Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Update Order Status
app.put("/api/order-status/:orderId", async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error("❌ Update status error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});




// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
