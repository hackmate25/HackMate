import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mainbg from "../assets/mainbg.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const Backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const isValidSrmEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/.test(email);

  /* 🔥 COOLDOWN TIMER */
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ---------------- STEP 1: SEND OTP ---------------- */
  const handleSignupInit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidSrmEmail(email)) {
      toast.error("Email must be a valid SRMIST email.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${Backend}/auth/signup-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
        setCooldown(30); // 🔥 START COOLDOWN
      } else {
        toast.error(data.message || "Signup failed.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 2: VERIFY OTP ---------------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${Backend}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Signup successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/details");
      } else {
        toast.error(data.message || "OTP verification failed.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    try {
      const res = await fetch(`${Backend}/auth/signup-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("OTP resent successfully!");
        setCooldown(30); // 🔥 RESET COOLDOWN
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${mainbg})` }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col items-center -mt-10 w-full max-w-md px-6">
        <h1 className="text-5xl mb-10 text-[#395EAA] font-['Lexend_Exa'] font-normal">
          Sign Up
        </h1>

        {step === 1 ? (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSignupInit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <input
              type="email"
              placeholder="SRM NetID (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer"
            >
              {loading ? "Verifying OTP..." : "Verify & Signup"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0}
              className="w-full py-2 bg-gray-200 text-[#395EAA] rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#395EAA] hover:underline font-semibold cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
