import api from "./api";

// ==========================================
// GET MY SKILLS
// ==========================================
export const getMySkills = async () => {
  const response = await api.get("/skills");
  return response.data;
};

// ==========================================
// ADD SKILL TO MY PROFILE
// ==========================================
export const addSkill = async (skillData) => {
  const response = await api.post("/skills", skillData);
  return response.data;
};

// ==========================================
// CREATE GLOBAL SKILL
// ==========================================

export const createSkill = async (skillName) => {
  const response = await api.post("/skills/catalog", {
    skillName,
    proficiency: "BEGINNER", // required by AddSkillRequest
  });

  return response.data;
};

// ==========================================
// GET ALL SKILLS (CATALOG)
// ==========================================
export const getAllSkills = async () => {
  const response = await api.get("/skills/catalog");
  return response.data;
};

// ==========================================
// UPDATE SKILL
// ==========================================
export const updateSkill = async (id, skillData) => {
  const response = await api.put(`/skills/${id}`, skillData);
  return response.data;
};

// ==========================================
// DELETE SKILL
// ==========================================
export const deleteSkill = async (id) => {
  await api.delete(`/skills/${id}`);
};

// ==========================================
// SEARCH SKILLS
// ==========================================
export const searchSkills = async (keyword) => {
  const response = await api.get("/skills/catalog/search", {
    params: { keyword },
  });
  return response.data;
};