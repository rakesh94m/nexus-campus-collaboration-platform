import api from "./api";

// ==========================================
// Get My Goals
// ==========================================

export const getMyGoals = async () => {
  const response = await api.get("/goals");
  return response.data;
};

// ==========================================
// Add Goal
// ==========================================

export const addGoal = async (goalData) => {
  const response = await api.post("/goals", goalData);
  return response.data;
};

// ==========================================
// Update Goal
// ==========================================

export const updateGoal = async (id, goalData) => {
  const response = await api.put(
    `/goals/${id}`,
    goalData
  );

  return response.data;
};

// ==========================================
// Delete Goal
// ==========================================

export const deleteGoal = async (id) => {
  await api.delete(`/goals/${id}`);
};