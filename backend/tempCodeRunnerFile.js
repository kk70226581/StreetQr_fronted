const shopkeeperSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  menu: { type: Object, default: {} }
});