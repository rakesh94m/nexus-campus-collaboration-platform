import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Layers, Check } from "lucide-react";

import {
  registerUser,
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
    section: "",
    specialization: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // ==========================================
  // Loading States
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // ==========================================
  // OTP States
  // ==========================================

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  // ==========================================
  // OTP Resend Timer
  // ==========================================

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ==========================================
  // Handle Input Changes
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // Send Registration OTP
  // ==========================================

  const handleSendOtp = async () => {
    if (!formData.email.trim()) {
      toast.error("Enter your email first.");
      return;
    }

    try {
      setOtpLoading(true);

      await sendRegistrationOtp({
        email: formData.email.trim(),
      });

      setOtpSent(true);
      setOtpVerified(false);
      setTimer(60);

      // Clear old OTP when resending
      setFormData((previous) => ({
        ...previous,
        otp: "",
      }));

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

  // ==========================================
  // Verify Registration OTP
  // ==========================================

  const handleVerifyOtp = async () => {
    if (!formData.otp.trim()) {
      toast.error("Enter the OTP.");
      return;
    }

    if (formData.otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    try {
      setVerifyLoading(true);

      await verifyRegistrationOtp({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
      });

      setOtpVerified(true);
      setTimer(0);

      toast.success("Email verified successfully!");
    } catch (error) {
      const message =
          error.response?.data?.message ||
          error.response?.data ||
          "OTP verification failed.";

      toast.error(message);
    } finally {
      setVerifyLoading(false);
    }
  };

  // ==========================================
  // Submit Registration
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.error("Please verify your email first.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.trim(),
        rollNumber: formData.rollNumber,
        department: formData.department,
        year: Number(formData.year),
        section: formData.section || null,
        specialization: formData.specialization || null,
        phone: formData.phone || null,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Registration failed.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Shared UI classes (visual only)
  // ==========================================

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  const sectionHeadingCls =
    "text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* ==========================================
            CARD
        ========================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">

          {/* ==========================================
              BRAND
          ========================================== */}

          <div className="flex items-center gap-2.5 mb-7">
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

          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Join NEXUS and start collaborating with your peers
            </p>
          </div>

          {/* ==========================================
              STEP INDICATOR
          ========================================== */}

          <div className="flex items-center gap-3 mb-8">

            {/* Step 1 */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all ${
                  otpVerified
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-blue-600 border-blue-600 text-white"
                }`}
              >
                {otpVerified ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  "1"
                )}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  !otpVerified ? "text-slate-800" : "text-slate-400"
                }`}
              >
                Verify Email
              </span>
            </div>

            {/* Connector line */}
            <div
              className={`flex-1 h-px transition-all ${
                otpVerified ? "bg-green-400" : "bg-slate-200"
              }`}
            />

            {/* Step 2 */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all ${
                  otpVerified
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  otpVerified ? "text-slate-800" : "text-slate-400"
                }`}
              >
                Complete Profile
              </span>
            </div>

          </div>

          {/* ==========================================
              FORM
          ========================================== */}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ==========================================
                EMAIL FIELD
            ========================================== */}

            <div>
              <label htmlFor="reg-email" className={labelCls}>
                Email address{" "}
                <span className="text-red-500" aria-hidden="true">*</span>
              </label>

              <div className="flex gap-2">
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  disabled={otpVerified}
                  placeholder="you@university.edu"
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    otpVerified
                      ? "bg-slate-50 border-green-400 text-slate-500 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  }`}
                />

                {!otpVerified && (
                  <button
                    type="button"
                    disabled={otpLoading || timer > 0}
                    onClick={handleSendOtp}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition whitespace-nowrap"
                  >
                    {otpLoading
                      ? "Sending..."
                      : timer > 0
                        ? `${timer}s`
                        : otpSent
                          ? "Resend OTP"
                          : "Send OTP"}
                  </button>
                )}
              </div>

              {/* Verified indicator */}
              {otpVerified && (
                <p className="flex items-center gap-1.5 text-green-600 text-sm mt-2 font-medium">
                  <Check size={14} strokeWidth={3} />
                  Email verified successfully
                </p>
              )}

              {/* OTP sent hint */}
              {otpSent && !otpVerified && (
                <p className="text-slate-500 text-xs mt-2">
                  OTP sent to your email. Check your inbox.
                </p>
              )}
            </div>

            {/* ==========================================
                OTP VERIFICATION FIELD
                Shown after OTP is sent, before verification
            ========================================== */}

            {otpSent && !otpVerified && (
              <div>
                <label htmlFor="reg-otp" className={labelCls}>
                  Verification Code (OTP){" "}
                  <span className="text-red-500" aria-hidden="true">*</span>
                </label>

                <div className="flex gap-2">
                  <input
                    id="reg-otp"
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    className={`flex-1 ${inputCls} tracking-widest`}
                  />

                  <button
                    type="button"
                    disabled={verifyLoading}
                    onClick={handleVerifyOtp}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition whitespace-nowrap"
                  >
                    {verifyLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  OTP is valid for 5 minutes.
                </p>
              </div>
            )}

            {/* ==========================================
                STEP 2 — PROFILE FORM
                Visible only after email is verified
            ========================================== */}

            {otpVerified && (
              <>

                {/* ── Personal Information ── */}
                <div>
                  <p className={sectionHeadingCls}>Personal Information</p>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label htmlFor="reg-firstName" className={labelCls}>
                          First Name{" "}
                          <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-firstName"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          maxLength={50}
                          required
                          placeholder="Rakesh"
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-lastName" className={labelCls}>
                          Last Name{" "}
                          <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-lastName"
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          maxLength={50}
                          required
                          placeholder="Meesa"
                          className={inputCls}
                        />
                      </div>

                    </div>
                  </div>
                </div>

                {/* ── Academic Information ── */}
                <div>
                  <p className={sectionHeadingCls}>Academic Information</p>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label htmlFor="reg-rollNumber" className={labelCls}>
                          Roll Number{" "}
                          <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-rollNumber"
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleChange}
                          required
                          maxLength={20}
                          placeholder="CB.EN.U4CSE22001"
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-department" className={labelCls}>
                          Department{" "}
                          <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-department"
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                          maxLength={50}
                          placeholder="CSE"
                          className={inputCls}
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label htmlFor="reg-year" className={labelCls}>
                          Year{" "}
                          <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="reg-year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          className={inputCls}
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="reg-section" className={labelCls}>
                          Section
                        </label>
                        <input
                          id="reg-section"
                          type="text"
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          placeholder="A"
                          maxLength={10}
                          className={inputCls}
                        />
                      </div>

                    </div>

                    <div>
                      <label htmlFor="reg-specialization" className={labelCls}>
                        Specialization
                      </label>
                      <input
                        id="reg-specialization"
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        maxLength={50}
                        placeholder="Artificial Intelligence"
                        className={inputCls}
                      />
                    </div>

                  </div>
                </div>

                {/* ── Contact Information ── */}
                <div>
                  <p className={sectionHeadingCls}>Contact Information</p>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div>
                      <label htmlFor="reg-phone" className={labelCls}>
                        Phone Number
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={15}
                        placeholder="9876543210"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Account Security ── */}
                <div>
                  <p className={sectionHeadingCls}>Account Security</p>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label htmlFor="reg-password" className={labelCls}>
                          Password{" "}
                          <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          minLength={8}
                          required
                          placeholder="Minimum 8 characters"
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-confirmPassword" className={labelCls}>
                          Confirm Password{" "}
                          <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="reg-confirmPassword"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Re-enter password"
                          className={inputCls}
                        />
                      </div>

                    </div>

                    <p className="text-xs text-slate-400">
                      Password must be at least 8 characters long.
                    </p>

                  </div>
                </div>

                {/* Create Account button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>

              </>
            )}

          </form>

          {/* ==========================================
              LOGIN LINK
          ========================================== */}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Register;