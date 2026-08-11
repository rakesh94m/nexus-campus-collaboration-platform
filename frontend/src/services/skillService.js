import api from "./api";

export const getMySkills = async () => {
  const response = await api.get("/skills");
  return response.data;
};

export const addSkill = async (skillData) => {
  const response = await api.post("/skills", skillData);
  return response.data;
};

export const updateSkill = async (id, skillData) => {
  const response = await api.put(`/skills/${id}`, skillData);
  return response.data;
};

export const deleteSkill = async (id) => {
  await api.delete(`/skills/${id}`);
};