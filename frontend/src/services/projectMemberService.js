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
// JOIN A PROJECT
// ==========================================

export const joinProject = async (
  projectId,
  role
) => {
  const response = await api.post(
    "/project-members",
    {
      projectId: Number(projectId),
      role,
    }
  );

  return response.data;
};

// ==========================================
// UPDATE MY / PROJECT MEMBER ROLE
// ==========================================

export const updateProjectMember = async (
  id,
  role
) => {
  const response = await api.put(
    `/project-members/${id}`,
    {
      role,
    }
  );

  return response.data;
};

// ==========================================
// LEAVE PROJECT
// ==========================================

export const leaveProject = async (id) => {
  await api.delete(
    `/project-members/${id}`
  );
};

// ==========================================
// REMOVE MEMBER BY PROJECT OWNER
// ==========================================

export const removeProjectMember = async (
  projectId,
  memberId
) => {
  await api.delete(
    `/project-members/project/${projectId}/member/${memberId}`
  );
};