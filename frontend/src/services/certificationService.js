import api from "./api";

// ==========================================
// GET MY CERTIFICATIONS
// ==========================================

export const getMyCertifications = async () => {
    const response =
        await api.get("/certifications");

    return response.data;
};

// ==========================================
// ADD CERTIFICATION
// ==========================================

export const addCertification = async (data) => {
    const response =
        await api.post(
            "/certifications",
            data
        );

    return response.data;
};

// ==========================================
// UPDATE CERTIFICATION
// ==========================================

export const updateCertification =
    async (id, data) => {

        const response =
            await api.put(
                `/certifications/${id}`,
                data
            );

        return response.data;
    };

// ==========================================
// DELETE CERTIFICATION
// ==========================================

export const deleteCertification =
    async (id) => {

        await api.delete(
            `/certifications/${id}`
        );
    };