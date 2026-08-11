import api from "./api";

export const getMyProfile = async () => {
  const response = await api.get("/students/me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/students/profile", profileData);
  return response.data;
};

export const updateSocialLinks = async (socialData) => {
  const response = await api.put("/students/social-links", socialData);
  return response.data;
};

export const updateAvailability = async (availabilityData) => {
  const response = await api.put("/students/availability", availabilityData);
  return response.data;
};


export const getAllStudents = async () => {
  const response = await api.get("/students");

  return response.data;
};

export const getStudentById = async (id) => {
  const response = await api.get(`/students/${id}`);

  return response.data;
};