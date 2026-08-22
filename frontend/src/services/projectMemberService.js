import api from "./api";

// ==========================================
// GET MY PROJECT MEMBERSHIPS
// ==========================================

export const getMyProjectMembers = async () => {
  const response = await api.get("/project-members");
  return response.data;
};

// ==========================================
// GET ALL MEMBERS OF A PROJECT
// ==========================================

export const getProjectMembers = async (projectId) => {
  const response = await api.get(
      `/project-members/project/${projectId}`
  );

  return response.data;
};

// ==========================================
// SEND JOIN REQUEST
// (Creates Collaboration Request)
// ==========================================

export const joinProject = async (
    projectId,
    role = "MEMBER"
) => {
  const response = await api.post(
      "/collaboration-requests",
      {
        projectId: Number(projectId),
        receiverId: 0,
        message: `I would like to join this project as ${role}.`,
      }
  );

  return response.data;
};

// ==========================================
// UPDATE MEMBER ROLE
// ==========================================

export const updateProjectMember = async (
    id,
    role
) => {
  const response = await api.put(
      `/project-members/${id}`,
      { role }
  );

  return response.data;
};

// ==========================================
// LEAVE PROJECT
// ==========================================

export const leaveProject = async (id) => {
  await api.delete(`/project-members/${id}`);
};

// ==========================================
// REMOVE MEMBER
// ==========================================

export const removeProjectMember = async (
    projectId,
    memberId
) => {
  await api.delete(
      `/project-members/project/${projectId}/member/${memberId}`
  );
};