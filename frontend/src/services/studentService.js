import api from "./api";

// ==========================================
// GET MY PROFILE
// ==========================================
export const getMyProfile = async () => {
  const response = await api.get("/students/me");
  return response.data;
};

// ==========================================
// UPDATE PROFILE
// ==========================================
export const updateProfile = async (profileData) => {
  const response = await api.put("/students/profile", profileData);
  return response.data;
};

// ==========================================
// UPDATE SOCIAL LINKS
// ==========================================
export const updateSocialLinks = async (socialData) => {
  const response = await api.put("/students/social-links", socialData);
  return response.data;
};

// ==========================================
// UPDATE AVAILABILITY
// ==========================================
export const updateAvailability = async (availabilityData) => {
  const response = await api.put("/students/availability", availabilityData);
  return response.data;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================
export const changePassword = async (passwordData) => {
  const response = await api.put(
      "/students/change-password",
      passwordData
  );
  return response.data;
};

// ==========================================
// STUDENT DISCOVERY
// ==========================================
export const getAllStudents = async () => {
  const response = await api.get("/students");
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};