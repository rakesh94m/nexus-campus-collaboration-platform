import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

          {/* ==========================================
            Header
        ========================================== */}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Join NEXUS
            </h1>

            <p className="text-gray-500 mt-2">
              Create your student account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ==========================================
              EMAIL
          ========================================== */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>

              <div className="flex gap-2">
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    disabled={otpVerified}
                    placeholder="you@example.com"
                    className={`flex-1 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                        otpVerified
                            ? "bg-gray-100 border-green-500 cursor-not-allowed"
                            : "border-gray-300"
                    }`}
                />

                {!otpVerified && (
                    <button
                        type="button"
                        disabled={otpLoading || timer > 0}
                        onClick={handleSendOtp}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {otpVerified && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    ✓ Email verified successfully
                  </p>
              )}

              {otpSent && !otpVerified && (
                  <p className="text-green-600 text-sm mt-2">
                    OTP sent to your email.
                  </p>
              )}
            </div>

            {/* ==========================================
              OTP VERIFICATION
          ========================================== */}

            {otpSent && !otpVerified && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Verification OTP *
                  </label>

                  <div className="flex gap-2">
                    <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="Enter 6-digit OTP"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.3em]"
                    />

                    <button
                        type="button"
                        disabled={verifyLoading}
                        onClick={handleVerifyOtp}
                        className="px-5 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyLoading
                          ? "Verifying..."
                          : "Verify OTP"}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    OTP is valid for 5 minutes.
                  </p>
                </div>
            )}

            {/* ==========================================
              REGISTRATION FORM
              Only visible after email verification
          ========================================== */}

            {otpVerified && (
                <>
                  {/* Name */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>

                      <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          maxLength={50}
                          required
                          placeholder="Rakesh"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>

                      <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          maxLength={50}
                          required
                          placeholder="Meesa"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Roll Number + Department */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roll Number *
                      </label>

                      <input
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleChange}
                          required
                          maxLength={20}
                          placeholder="CB.EN.U4CSE22001"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>

                      <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                          maxLength={50}
                          placeholder="CSE"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Year + Section */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year *
                      </label>

                      <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section
                      </label>

                      <input
                          type="text"
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          placeholder="A"
                          maxLength={10}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Specialization + Phone */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>

                      <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          maxLength={50}
                          placeholder="Artificial Intelligence"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>

                      <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength={15}
                          placeholder="9876543210"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Password */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>

                      <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          minLength={8}
                          required
                          placeholder="Minimum 8 characters"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>

                      <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Confirm password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Create Account */}

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                        ? "Creating Account..."
                        : "Create Account"}
                  </button>
                </>
            )}
          </form>

          {/* Login Link */}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
  );
};

export default Register;