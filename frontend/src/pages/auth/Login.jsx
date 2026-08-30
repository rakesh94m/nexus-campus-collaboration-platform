import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Layers, X } from "lucide-react";

import {
  loginUser,
  sendForgotPasswordOtp,
  resetPassword,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI-only toggle — does not touch auth logic
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Forgot Password States
  // ==========================================

  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ==========================================
  // Login
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      const token = data.token;

      const studentData = {
        studentId: data.studentId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };

      login(token, studentData);

      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Login failed.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Forgot Password
  // ==========================================

  const handleForgotChange = (e) => {
    const { name, value } = e.target;

    setForgotData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    if (!forgotData.email) {
      toast.error("Enter your email.");
      return;
    }

    try {
      setOtpLoading(true);

      await sendForgotPasswordOtp({
        email: forgotData.email,
      });

      setOtpSent(true);

      toast.success("OTP sent to your email.");
    } catch (error) {
      const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to send OTP.";

      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (
        !forgotData.email ||
        !forgotData.otp ||
        !forgotData.newPassword ||
        !forgotData.confirmPassword
    ) {
      toast.error("Fill all fields.");
      return;
    }

    try {
      await resetPassword(forgotData);

      toast.success("Password reset successfully!");

      setShowForgot(false);
      setOtpSent(false);

      setForgotData({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Reset failed.";

      toast.error(message);
    }
  };

  // ==========================================
  // Shared UI classes (visual only)
  // ==========================================

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  // ==========================================
  // Modal close helper (resets all forgot state)
  // ==========================================

  const closeForgotModal = () => {
    setShowForgot(false);
    setOtpSent(false);
    setForgotData({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>

      {/* ==========================================
          PAGE WRAPPER
      ========================================== */}

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-4xl">

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex min-h-[520px]">

            {/* ==========================================
                LEFT BRAND PANEL — lg+ only
            ========================================== */}

            <div className="hidden lg:flex flex-col justify-between w-[44%] bg-slate-900 p-10 shrink-0">

              {/* Top: brand + features */}
              <div>

                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-10">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Layers size={18} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">
                    NEXUS
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-xl font-bold text-white leading-snug">
                  Campus Collaboration<br />Intelligence Platform
                </h1>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Connect with peers, discover projects, and build your career
                  with AI-powered recommendations.
                </p>

                {/* Feature list */}
                <div className="mt-8 space-y-3">
                  {[
                    "AI-powered project matching",
                    "Real-time collaboration requests",
                    "Personalized career roadmap",
                    "Smart student discovery",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <p className="text-sm text-slate-400">{feature}</p>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom: copyright */}
              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} NEXUS · Campus Intelligence
              </p>

            </div>

            {/* ==========================================
                RIGHT FORM PANEL
            ========================================== */}

            <div className="flex-1 flex flex-col justify-center p-8 sm:p-10">

              {/* Mobile brand header (shown below lg) */}
              <div className="lg:hidden flex items-center gap-2.5 mb-8">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <Layers size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none tracking-tight">
                    NEXUS
                  </p>
                  <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                    Campus Intelligence
                  </p>
                </div>
              </div>

              {/* Form heading */}
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Sign in to your NEXUS student account
                </p>
              </div>

              {/* ==========================================
                  LOGIN FORM
              ========================================== */}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label htmlFor="login-email" className={labelCls}>
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    autoComplete="email"
                    className={inputCls}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    {/* Forgot password trigger */}
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`${inputCls} pr-10`}
                    />
                    {/* Show / hide toggle — UI only, no logic change */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition mt-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

              </form>

              {/* Register link */}
              <p className="text-center text-sm text-slate-500 mt-6">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Create account
                </Link>
              </p>

            </div>

          </div>
        </div>
      </div>

      {/* ==========================================
          FORGOT PASSWORD MODAL
      ========================================== */}

      {showForgot && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-4 py-6 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden">

            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Reset Password
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {otpSent
                      ? "Enter the OTP from your email and set a new password."
                      : "Enter your registered email to receive a verification code."}
                  </p>
                </div>
                <button
                  onClick={closeForgotModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0 mt-0.5"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-4">
                <div className={`flex items-center gap-1.5 text-xs font-medium ${!otpSent ? "text-blue-600" : "text-slate-400"}`}>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                      !otpSent
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-slate-100 border-slate-300 text-slate-500"
                    }`}
                  >
                    1
                  </span>
                  Send OTP
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <div className={`flex items-center gap-1.5 text-xs font-medium ${otpSent ? "text-blue-600" : "text-slate-400"}`}>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                      otpSent
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-slate-100 border-slate-300 text-slate-400"
                    }`}
                  >
                    2
                  </span>
                  Reset Password
                </div>
              </div>

            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">

              {/* Email */}
              <div>
                <label htmlFor="forgot-email" className={labelCls}>
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  placeholder="Enter your registered email"
                  className={inputCls}
                />
              </div>

              {/* Send OTP */}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {otpLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  otpSent ? "Resend OTP" : "Send OTP"
                )}
              </button>

              {/* Step 2 — OTP + new passwords (shown after OTP sent) */}
              {otpSent && (
                <div className="border-t border-slate-100 pt-4 space-y-4">

                  <div>
                    <label htmlFor="forgot-otp" className={labelCls}>
                      Verification Code (OTP)
                    </label>
                    <input
                      id="forgot-otp"
                      type="text"
                      name="otp"
                      value={forgotData.otp}
                      onChange={handleForgotChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      inputMode="numeric"
                      className={`${inputCls} tracking-widest`}
                    />
                  </div>

                  <div>
                    <label htmlFor="forgot-newpw" className={labelCls}>
                      New Password
                    </label>
                    <input
                      id="forgot-newpw"
                      type="password"
                      name="newPassword"
                      value={forgotData.newPassword}
                      onChange={handleForgotChange}
                      placeholder="Enter new password"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="forgot-confirmpw" className={labelCls}>
                      Confirm New Password
                    </label>
                    <input
                      id="forgot-confirmpw"
                      type="password"
                      name="confirmPassword"
                      value={forgotData.confirmPassword}
                      onChange={handleForgotChange}
                      placeholder="Re-enter new password"
                      className={inputCls}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full py-2.5 px-4 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                  >
                    Reset Password
                  </button>

                </div>
              )}

            </div>

            {/* Modal footer — Cancel */}
            <div className="px-6 pb-5">
              <button
                type="button"
                onClick={closeForgotModal}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default Login;