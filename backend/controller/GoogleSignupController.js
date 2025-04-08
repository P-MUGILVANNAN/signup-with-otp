const express = require('express');
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema"); // your Mongoose user schema
const router = express.Router();

router.post('/google',async (req, res) => {
  try {
    const { name, email, photo, uid } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        photo,
        googleId: uid,
        password: "google-oauth", // placeholder or hashed dummy
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, user, token });

  } catch (err) {
    res.status(500).json({ success: false, message: "Google signup failed", error: err.message });
  }
});

// POST /api/auth/otp
router.post('/otp', async (req, res) => {
  const { phone, uid } = req.body;

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, uid, name: "PhoneUser" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, user, token });
});


module.exports = router;
