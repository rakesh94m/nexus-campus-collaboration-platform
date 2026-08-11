import api from "./api";

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

export const getNotifications = async () => {
  const response = await api.get("/notifications");

  return response.data;
};

// ==========================================
// GET NOTIFICATION BY ID
// ==========================================

export const getNotificationById = async (id) => {
  const response = await api.get(
    `/notifications/${id}`
  );

  return response.data;
};

// ==========================================
// UPDATE NOTIFICATION STATUS
// ==========================================

export const updateNotification = async (
  id,
  status
) => {
  const response = await api.put(
    `/notifications/${id}`,
    {
      status,
    }
  );

  return response.data;
};

// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification = async (id) => {
  await api.delete(
    `/notifications/${id}`
  );
};