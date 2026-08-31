import api from "./api";

// ==========================================
// GET MY ACHIEVEMENTS
// ==========================================

export const getMyAchievements = async () => {
    const response = await api.get("/achievements");
    return response.data;
};

// ==========================================
// GET ACHIEVEMENT BY ID
// ==========================================

export const getAchievementById = async (id) => {
    const response = await api.get(`/achievements/${id}`);
    return response.data;
};

// ==========================================
// ADD ACHIEVEMENT
// ==========================================

export const addAchievement = async (achievementData) => {
    const response = await api.post(
        "/achievements",
        achievementData
    );

    return response.data;
};

// ==========================================
// UPDATE ACHIEVEMENT
// ==========================================

export const updateAchievement = async (
    id,
    achievementData
) => {
    const response = await api.put(
        `/achievements/${id}`,
        achievementData
    );

    return response.data;
};

// ==========================================
// DELETE ACHIEVEMENT
// ==========================================

export const deleteAchievement = async (id) => {
    await api.delete(`/achievements/${id}`);
};