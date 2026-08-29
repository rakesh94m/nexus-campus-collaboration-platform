import api from "./api";

// ==========================================
// LOGIN
// ==========================================
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// ==========================================
// REGISTER
// ==========================================
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// ==========================================
// SEND REGISTRATION OTP
// ==========================================
export const sendRegistrationOtp = async (data) => {
  const response = await api.post(
      "/auth/send-registration-otp",
      data
  );

  return response.data;
};

// ==========================================
// VERIFY REGISTRATION OTP
// ==========================================
export const verifyRegistrationOtp = async (data) => {
  const response = await api.post(
      "/auth/verify-registration-otp",
      data
  );

  return response.data;
};

// ==========================================
// SEND FORGOT PASSWORD OTP
// ==========================================
export const sendForgotPasswordOtp = async (data) => {
  const response = await api.post(
      "/auth/send-forgot-password-otp",
      data
  );

  return response.data;
};

// ==========================================
// RESET PASSWORD
// ==========================================
export const resetPassword = async (data) => {
  const response = await api.post(
      "/auth/reset-password",
      data
  );

  return response.data;
};