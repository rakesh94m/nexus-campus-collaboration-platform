import api from "./api";

// ==========================================
// GET MY PROJECTS
// ==========================================
export const getMyProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

// ==========================================
// GET AVAILABLE PROJECTS
// ==========================================
export const getAvailableProjects = async () => {
  const response = await api.get("/projects/available");
  return response.data;
};

// ==========================================
// ADD PROJECT
// ==========================================
export const addProject = async (projectData) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return response.data;
};

// ==========================================
// UPDATE PROJECT
// ==========================================
export const updateProject = async (
  id,
  projectData
) => {
  const response = await api.put(
    `/projects/${id}`,
    projectData
  );

  return response.data;
};

// ==========================================
// DELETE PROJECT
// ==========================================
export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};