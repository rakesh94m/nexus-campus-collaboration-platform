import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    Ticket,
    Clock,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    X,
    User,
    Mail,
    Tag,
    FileText,
    ShieldCheck,
    ChevronDown,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
    getAllSupportTickets,
    updateSupportTicketStatus,
} from "../../services/supportService";


// ==========================================
// HELPERS
// ==========================================

const formatCategory = (value) => {
    if (!value) return "";
    return value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    return new Date(dateValue).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const getStatusStyle = (status) => {
    switch (status) {
        case "RESOLVED":
            return {
                icon: CheckCircle2,
                badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                label: "Resolved",
            };
        case "IN_PROGRESS":
            return {
                icon: RefreshCw,
                badge: "bg-blue-50 text-blue-700 border-blue-200",
                label: "In Progress",
            };
        case "CLOSED":
            return {
                icon: CheckCircle2,
                badge: "bg-slate-100 text-slate-600 border-slate-200",
                label: "Closed",
            };
        case "OPEN":
        default:
            return {
                icon: Clock,
                badge: "bg-amber-50 text-amber-700 border-amber-200",
                label: "Open",
            };
    }
};


// ==========================================
// ADMIN SUPPORT TICKETS PAGE
// ==========================================

const AdminSupportTickets = () => {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("ALL");

    // ==========================================
    // LOAD ALL TICKETS
    // ==========================================

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await getAllSupportTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to load support tickets:", error);
            const msg =
                error?.response?.data?.message ||
                "Failed to load support tickets.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    // ==========================================
    // UPDATE TICKET STATUS
    // ==========================================

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            setUpdatingId(ticketId);
            const updated = await updateSupportTicketStatus(ticketId, newStatus);

            // Update both the list and the selected ticket detail
            setTickets((prev) =>
                prev.map((t) => (t.id === ticketId ? { ...t, ...updated } : t))
            );

            if (selectedTicket?.id === ticketId) {
                setSelectedTicket((prev) => ({ ...prev, ...updated }));
            }

            toast.success(`Ticket #${ticketId} status updated to ${formatCategory(newStatus)}.`);
        } catch (error) {
            console.error("Failed to update ticket status:", error);
            const msg =
                error?.response?.data?.message ||
                "Failed to update ticket status.";
            toast.error(msg);
        } finally {
            setUpdatingId(null);
        }
    };

    // ==========================================
    // FILTERED TICKETS
    // ==========================================

    const filteredTickets =
        filterStatus === "ALL"
            ? tickets
            : tickets.filter((t) => t.status === filterStatus);

    // ==========================================
    // STAT COUNTS
    // ==========================================

    const statCounts = {
        ALL: tickets.length,
        OPEN: tickets.filter((t) => t.status === "OPEN").length,
        IN_PROGRESS: tickets.filter((t) => t.status === "IN_PROGRESS").length,
        RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
        CLOSED: tickets.filter((t) => t.status === "CLOSED").length,
    };


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1.5">
                            Admin Panel
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Support Tickets
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            View and manage all student support requests.
                        </p>
                    </div>

                    <button
                        onClick={loadTickets}
                        disabled={loading}
                        title="Refresh"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        <RefreshCw
                            size={15}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>


                {/* ==========================================
                    STATS BAR
                ========================================== */}

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                        { key: "ALL", label: "All Tickets", color: "text-slate-700 bg-slate-50 border-slate-200" },
                        { key: "OPEN", label: "Open", color: "text-amber-700 bg-amber-50 border-amber-200" },
                        { key: "IN_PROGRESS", label: "In Progress", color: "text-blue-700 bg-blue-50 border-blue-200" },
                        { key: "RESOLVED", label: "Resolved", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                        { key: "CLOSED", label: "Closed", color: "text-slate-500 bg-slate-100 border-slate-200" },
                    ].map((stat) => (
                        <button
                            key={stat.key}
                            onClick={() => setFilterStatus(stat.key)}
                            className={[
                                "flex flex-col items-start p-4 rounded-xl border transition text-left",
                                stat.color,
                                filterStatus === stat.key
                                    ? "ring-2 ring-offset-1 ring-violet-400"
                                    : "hover:opacity-90",
                            ].join(" ")}
                        >
                            <span className="text-2xl font-bold leading-none">
                                {statCounts[stat.key]}
                            </span>
                            <span className="text-xs font-semibold mt-1 opacity-80">
                                {stat.label}
                            </span>
                        </button>
                    ))}
                </div>


                {/* ==========================================
                    MAIN CONTENT — LIST + DETAIL PANEL
                ========================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* ==========================================
                        TICKET LIST
                    ========================================== */}

                    <div className={selectedTicket ? "lg:col-span-2" : "lg:col-span-5"}>
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                            {/* List header */}
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                                <h2 className="font-bold text-slate-900 text-sm">
                                    {filterStatus === "ALL"
                                        ? "All Tickets"
                                        : formatCategory(filterStatus) + " Tickets"}{" "}
                                    <span className="text-slate-400 font-normal">
                                        ({filteredTickets.length})
                                    </span>
                                </h2>
                            </div>

                            {/* Loading */}
                            {loading && (
                                <div className="flex items-center justify-center gap-3 py-20">
                                    <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm text-slate-500">Loading tickets...</p>
                                </div>
                            )}

                            {/* Empty */}
                            {!loading && filteredTickets.length === 0 && (
                                <div className="py-20 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                                        <Ticket size={28} />
                                    </div>
                                    <h3 className="font-bold text-slate-900">No tickets found</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {filterStatus === "ALL"
                                            ? "There are no support tickets yet."
                                            : `No ${formatCategory(filterStatus).toLowerCase()} tickets.`}
                                    </p>
                                </div>
                            )}

                            {/* Ticket rows */}
                            {!loading && filteredTickets.length > 0 && (
                                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                    {filteredTickets.map((ticket) => {
                                        const statusInfo = getStatusStyle(ticket.status);
                                        const StatusIcon = statusInfo.icon;
                                        const isSelected = selectedTicket?.id === ticket.id;

                                        return (
                                            <button
                                                key={ticket.id}
                                                onClick={() =>
                                                    setSelectedTicket(
                                                        isSelected ? null : ticket
                                                    )
                                                }
                                                className={[
                                                    "w-full text-left px-5 py-4 transition",
                                                    isSelected
                                                        ? "bg-violet-50 border-l-4 border-l-violet-500"
                                                        : "hover:bg-slate-50 border-l-4 border-l-transparent",
                                                ].join(" ")}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        {/* Ticket # + category */}
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs font-bold text-slate-400">
                                                                #{ticket.id}
                                                            </span>
                                                            <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                                                                {formatCategory(ticket.category)}
                                                            </span>
                                                        </div>

                                                        {/* Subject */}
                                                        <p className="text-sm font-semibold text-slate-900 mt-1.5 truncate">
                                                            {ticket.subject}
                                                        </p>

                                                        {/* Student */}
                                                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                            {ticket.studentFullName || `Student #${ticket.studentId}`}
                                                        </p>
                                                    </div>

                                                    {/* Status badge */}
                                                    <span
                                                        className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${statusInfo.badge}`}
                                                    >
                                                        <StatusIcon
                                                            size={11}
                                                            className={ticket.status === "IN_PROGRESS" ? "animate-spin" : ""}
                                                        />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                                                    <Clock size={12} />
                                                    {formatDate(ticket.createdAt)}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>


                    {/* ==========================================
                        TICKET DETAIL PANEL
                    ========================================== */}

                    {selectedTicket && (
                        <div className="lg:col-span-3">
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-6">

                                {/* Detail header */}
                                <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">
                                            Ticket #{selectedTicket.id}
                                        </p>
                                        <h2 className="text-lg font-bold text-slate-900 mt-1 leading-snug">
                                            {selectedTicket.subject}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
                                        aria-label="Close detail panel"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>

                                {/* Detail body */}
                                <div className="px-6 py-5 space-y-5">

                                    {/* Student info */}
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <User size={14} className="text-slate-400 shrink-0" />
                                            <span className="font-semibold">
                                                {selectedTicket.studentFullName || `Student #${selectedTicket.studentId}`}
                                            </span>
                                        </div>
                                        {selectedTicket.studentEmail && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Mail size={14} className="text-slate-400 shrink-0" />
                                                {selectedTicket.studentEmail}
                                            </div>
                                        )}
                                    </div>

                                    {/* Meta row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                                <Tag size={12} />
                                                Category
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {formatCategory(selectedTicket.category)}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                                <Clock size={12} />
                                                Submitted
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {formatDate(selectedTicket.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                            <FileText size={13} />
                                            Message
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                                            {selectedTicket.message}
                                        </div>
                                    </div>

                                    {/* Status updater */}
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-3">
                                            <ShieldCheck size={14} className="text-violet-500" />
                                            Update Status
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {STATUS_OPTIONS.map((statusOption) => {
                                                const info = getStatusStyle(statusOption);
                                                const isCurrentStatus =
                                                    selectedTicket.status === statusOption;
                                                const isUpdating =
                                                    updatingId === selectedTicket.id;

                                                return (
                                                    <button
                                                        key={statusOption}
                                                        id={`status-btn-${statusOption.toLowerCase()}`}
                                                        onClick={() =>
                                                            !isCurrentStatus &&
                                                            handleStatusChange(
                                                                selectedTicket.id,
                                                                statusOption
                                                            )
                                                        }
                                                        disabled={isCurrentStatus || isUpdating}
                                                        className={[
                                                            "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition",
                                                            isCurrentStatus
                                                                ? `${info.badge} ring-2 ring-offset-1 ring-violet-400 cursor-default`
                                                                : `border-slate-200 text-slate-600 bg-white hover:border-slate-300 hover:bg-slate-50`,
                                                            isUpdating && !isCurrentStatus
                                                                ? "opacity-50 cursor-wait"
                                                                : "",
                                                        ].join(" ")}
                                                    >
                                                        {isUpdating && !isCurrentStatus ? (
                                                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin shrink-0" />
                                                        ) : (
                                                            <info.icon size={13} className="shrink-0" />
                                                        )}
                                                        {info.label}
                                                        {isCurrentStatus && (
                                                            <span className="ml-auto text-[10px] font-bold opacity-70">
                                                                Current
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Last updated */}
                                    {selectedTicket.updatedAt && (
                                        <p className="text-xs text-slate-400 text-right">
                                            Last updated: {formatDate(selectedTicket.updatedAt)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>


                {/* ==========================================
                    ADMIN NOTICE
                ========================================== */}

                <div className="flex items-start gap-3 p-5 rounded-2xl bg-violet-50 border border-violet-100">
                    <ShieldCheck size={20} className="text-violet-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-violet-900">Admin Access Only</h3>
                        <p className="text-sm text-violet-700 mt-1">
                            This page is only visible to administrators. All status changes are enforced by the backend and require a valid ADMIN JWT token.
                        </p>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default AdminSupportTickets;
