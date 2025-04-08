const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // Only for email/password signup
  photo: { type: String },    // For Google profile
  googleId: { type: String }, // Firebase UID from Google
  phone: { type: String, unique: true, sparse: true }, // Phone auth
  uid: { type: String }, // Firebase UID from phone auth
}, { timestamps: true });

// Hash password before saving (only if it exists and modified)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison
UserSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
