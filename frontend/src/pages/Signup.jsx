import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.config";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      setMessage("OTP sent to your email address.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: formData.email,
        otp,
      });
      setEmailVerified(true);
      setMessage("Email verified successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!emailVerified) {
      setMessage("Please verify your email first.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage(res.data.message);
      setFormData({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed!");
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const res = await axios.post("http://localhost:5000/api/auth/google", {
        name: googleUser.displayName,
        email: googleUser.email,
        photo: googleUser.photoURL,
        uid: googleUser.uid,
      });

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Google signup error:", error);
      setMessage("Google signup failed.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Signup</h2>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
              </div>

              {otpSent ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Enter OTP</label>
                    <input type="text" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  </div>
                  <button type="button" className="btn btn-outline-success mb-3" onClick={handleVerifyOtp}>
                    Verify OTP
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-outline-primary mb-3" onClick={handleSendOtp}>
                  Send OTP
                </button>
              )}

              <button type="submit" className="btn btn-info w-100" disabled={loading || !emailVerified}>
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            <div><hr /><p className="text-center">Or</p></div>

            <div className="d-grid gap-2">
              <button type="button" className="btn btn-outline-danger" onClick={handleGoogleSignup}>
                Sign Up with Google
              </button>
            </div>

            <p className="mt-3 text-center">
              Already have an account? <Link to="/login" className="text-warning">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
