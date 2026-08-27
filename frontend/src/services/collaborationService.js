import api from "./api";

// ==========================================
// GET RECEIVED REQUESTS
// ==========================================

export const getReceivedRequests = async () => {
    const response = await api.get(
        "/collaboration-requests/received"
    );

    return response.data;
};

// ==========================================
// GET SENT REQUESTS
// ==========================================

export const getSentRequests = async () => {
    const response = await api.get(
        "/collaboration-requests/sent"
    );

    return response.data;
};

// ==========================================
// SEND COLLABORATION REQUEST
// ==========================================

export const sendCollaborationRequest = async (
    receiverId,
    projectId,
    requestedRole,
    message
) => {
    const response = await api.post(
        "/collaboration-requests",
        {
            receiverId: Number(receiverId),
            projectId: Number(projectId),
            requestedRole,
            message: message.trim(),
        }
    );

    return response.data;
};

// ==========================================
// ACCEPT / REJECT REQUEST
// ==========================================

export const updateCollaborationRequest = async (
    id,
    status
) => {
    const response = await api.put(
        `/collaboration-requests/${id}`,
        {
            status,
        }
    );

    return response.data;
};

// ==========================================
// DELETE REQUEST
// ==========================================

export const deleteCollaborationRequest = async (id) => {
    await api.delete(
        `/collaboration-requests/${id}`
    );
};