import api from "./api";

// ==========================================
// Generate AI Career Roadmap
// ==========================================

export const generateCareerRoadmap = async () => {
  const response = await api.post(
    "/career-roadmaps/generate"
  );

  return response.data;
};

// ==========================================
// Get My Career Roadmap History
// ==========================================

export const getMyCareerRoadmaps = async () => {
  const response = await api.get(
    "/career-roadmaps/my"
  );

  return response.data;
};

// ==========================================
// Get Latest Career Roadmap
// ==========================================

export const getLatestCareerRoadmap = async () => {
  const response = await api.get(
    "/career-roadmaps/latest"
  );

  return response.data;
};

// ==========================================
// Get Career Roadmap By ID
// ==========================================

export const getCareerRoadmapById = async (id) => {
  const response = await api.get(
    `/career-roadmaps/${id}`
  );

  return response.data;
};

// ==========================================
// Delete Career Roadmap
// ==========================================

export const deleteCareerRoadmap = async (id) => {
  await api.delete(
    `/career-roadmaps/${id}`
  );
};