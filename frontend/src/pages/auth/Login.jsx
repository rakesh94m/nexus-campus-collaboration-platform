import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

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

  return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">NEXUS</h1>

              <p className="text-gray-500 mt-2">
                Campus Collaboration Platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-right">
                <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* ==========================================
          FORGOT PASSWORD MODAL
      ========================================== */}

        {showForgot && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reset Password
                </h2>

                <p className="text-sm text-gray-500">
                  Receive an OTP and create a new password.
                </p>

                <input
                    type="email"
                    name="email"
                    value={forgotData.email}
                    onChange={handleForgotChange}
                    placeholder="Enter email"
                    className="w-full px-4 py-3 border rounded-lg"
                />

                <button
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg"
                >
                  {otpLoading ? "Sending..." : "Send OTP"}
                </button>

                {otpSent && (
                    <>
                      <input
                          type="text"
                          name="otp"
                          value={forgotData.otp}
                          onChange={handleForgotChange}
                          placeholder="Enter OTP"
                          className="w-full px-4 py-3 border rounded-lg"
                      />

                      <input
                          type="password"
                          name="newPassword"
                          value={forgotData.newPassword}
                          onChange={handleForgotChange}
                          placeholder="New Password"
                          className="w-full px-4 py-3 border rounded-lg"
                      />

                      <input
                          type="password"
                          name="confirmPassword"
                          value={forgotData.confirmPassword}
                          onChange={handleForgotChange}
                          placeholder="Confirm Password"
                          className="w-full px-4 py-3 border rounded-lg"
                      />

                      <button
                          onClick={handleResetPassword}
                          className="w-full py-2 bg-green-600 text-white rounded-lg"
                      >
                        Reset Password
                      </button>
                    </>
                )}

                <button
                    onClick={() => {
                      setShowForgot(false);
                      setOtpSent(false);

                      setForgotData({
                        email: "",
                        otp: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="w-full py-2 border rounded-lg text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
        )}
      </>
  );
};

export default Login;