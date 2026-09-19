import api from "./api";


// ==========================================
// CREATE SUPPORT TICKET
// POST /api/support/tickets
// ==========================================

export const createSupportTicket = async (
    ticketData
) => {

    const response = await api.post(
        "/support/tickets",
        ticketData
    );

    return response.data;

};


// ==========================================
// GET MY SUPPORT TICKETS
// GET /api/support/tickets/my
// ==========================================

export const getMySupportTickets =
    async () => {

        const response = await api.get(
            "/support/tickets/my"
        );

        return response.data;

    };


// ==========================================
// GET SUPPORT TICKET BY ID
// GET /api/support/tickets/{id}
// ==========================================

export const getSupportTicketById =
    async (id) => {

        const response = await api.get(
            `/support/tickets/${id}`
        );

        return response.data;

    };


// ==========================================
// GET ALL SUPPORT TICKETS (ADMIN ONLY)
// GET /api/support/tickets/admin/all
// ==========================================

export const getAllSupportTickets =
    async () => {

        const response = await api.get(
            "/support/tickets/admin/all"
        );

        return response.data;

    };


// ==========================================
// UPDATE SUPPORT TICKET STATUS (ADMIN ONLY)
// PUT /api/support/tickets/{id}/status
// ==========================================

export const updateSupportTicketStatus =
    async (id, status) => {

        const response = await api.put(
            `/support/tickets/${id}/status`,
            { status }
        );

        return response.data;

    };