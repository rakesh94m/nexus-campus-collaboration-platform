import api from "./api";

export const getMyInterests = async () => {
  const response = await api.get("/interests");
  return response.data;
};

export const addInterest = async (interestData) => {
  const response = await api.post("/interests", interestData);
  return response.data;
};

export const updateInterest = async (id, interestData) => {
  const response = await api.put(`/interests/${id}`, interestData);
  return response.data;
};

export const deleteInterest = async (id) => {
  await api.delete(`/interests/${id}`);
};