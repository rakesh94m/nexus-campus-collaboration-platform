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