import api from "./api";

// ==========================================
// GET SMART PROJECT MATCHES
// ==========================================

export const getProjectMatches = async () => {
  const response = await api.get("/matching/projects");

  return response.data;
};