import api from "./api";

// ==========================================
// GET AI PROJECT RECOMMENDATIONS
// ==========================================

export const getProjectRecommendations = async () => {
  const response = await api.get("/recommendations/projects");

  return response.data;
};