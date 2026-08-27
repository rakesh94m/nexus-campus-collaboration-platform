import api from "./api";

// ==========================================
// GET SMART PROJECT MATCHES
//
// Java smart matching only.
// NO GEMINI CALL.
// ==========================================

export const getProjectMatches = async () => {
  const response = await api.get("/matching/projects");

  return response.data;
};


// ==========================================
// GET MATCH HISTORY
// ==========================================

export const getMatchHistory = async () => {
  const response = await api.get("/match-history");

  return response.data;
};


// ==========================================
// GENERATE AI RECOMMENDATION
//
// Gemini is called only when the user
// clicks "Generate AI Analysis".
// ==========================================

export const generateAIRecommendation = async (
    projectId
) => {

  const response =
      await api.post(
          `/matching/projects/${projectId}/ai-recommendation`
      );

  return response.data;
};