import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    CircleHelp,
    Send,
    Ticket,
    Clock,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
    createSupportTicket,
    getMySupportTickets,
} from "../../services/supportService";


const Support = () => {

    // ==========================================
    // FORM STATE
    // ==========================================

    const [category, setCategory] = useState("GENERAL");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    // ==========================================
    // TICKETS STATE
    // ==========================================

    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // ==========================================
    // LOAD SUPPORT TICKETS
    // ==========================================

    const loadTickets = async () => {
        try {
            setLoadingTickets(true);
            const data = await getMySupportTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to load support tickets:", error);
            toast.error("Failed to load support tickets.");
        } finally {
            setLoadingTickets(false);
        }
    };

    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {
        loadTickets();
    }, []);

    // ==========================================
    // CREATE SUPPORT TICKET
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic frontend validation

        if (!category) {
            toast.error("Please select a category.");
            return;
        }

        if (!subject.trim()) {
            toast.error("Please enter a subject.");
            return;
        }

        if (!message.trim()) {
            toast.error("Please describe your issue.");
            return;
        }

        try {
            setSubmitting(true);

            const ticketData = {
                category: category,
                subject: subject.trim(),
                message: message.trim(),
            };

            const createdTicket = await createSupportTicket(ticketData);

            // Add newly created ticket to the top immediately
            setTickets((previousTickets) => [createdTicket, ...previousTickets]);

            // Reset form
            setCategory("GENERAL");
            setSubject("");
            setMessage("");

            toast.success("Support ticket created successfully!");
        } catch (error) {
            console.error("Failed to create support ticket:", error);
            const errorMessage =
                error?.response?.data?.message ||
                "Failed to create support ticket.";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // FORMAT CATEGORY
    // ==========================================

    const formatCategory = (category) => {
        if (!category) return "General";
        return category
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (dateValue) => {
        if (!dateValue) return "";
        return new Date(dateValue).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "RESOLVED":
                return {
                    icon: CheckCircle2,
                    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
                };
            case "IN_PROGRESS":
                return {
                    icon: RefreshCw,
                    className: "bg-blue-50 text-blue-700 border-blue-200",
                };
            case "CLOSED":
                return {
                    icon: CheckCircle2,
                    className: "bg-slate-100 text-slate-700 border-slate-200",
                };
            case "OPEN":
            default:
                return {
                    icon: Clock,
                    className: "bg-amber-50 text-amber-700 border-amber-200",
                };
        }
    };

    // ==========================================
    // FIELD CLASSES
    // ==========================================

    const inputCls =
        "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60";

    const labelCls = "block text-sm font-semibold text-slate-700 mb-2";


    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1.5">
                        Help
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Help &amp; Support
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Create a support ticket and track your requests.
                    </p>
                </div>

                {/* ==========================================
                    MAIN GRID
                ========================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* ==========================================
                        CREATE TICKET
                    ========================================== */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Ticket size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Create Support Ticket</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Tell us what issue you are facing.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* CATEGORY */}
                            <div>
                                <label htmlFor="support-category" className={labelCls}>
                                    Category
                                </label>
                                <select
                                    id="support-category"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    disabled={submitting}
                                    className={inputCls}
                                >
                                    <option value="GENERAL">General Question</option>
                                    <option value="ACCOUNT_ISSUE">Account Issue</option>
                                    <option value="BUG_REPORT">Bug Report</option>
                                    <option value="TECHNICAL_ISSUE">Technical Issue</option>
                                    <option value="FEATURE_REQUEST">Feature Request</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* SUBJECT */}
                            <div>
                                <label htmlFor="support-subject" className={labelCls}>
                                    Subject
                                </label>
                                <input
                                    id="support-subject"
                                    type="text"
                                    value={subject}
                                    onChange={(event) => setSubject(event.target.value)}
                                    maxLength={150}
                                    disabled={submitting}
                                    placeholder="Briefly describe your issue"
                                    className={inputCls}
                                />
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="support-message" className="block text-sm font-semibold text-slate-700">
                                        Describe your issue <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-slate-400">{message.length}/5000</span>
                                </div>
                                <textarea
                                    id="support-message"
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    maxLength={5000}
                                    rows={6}
                                    disabled={submitting}
                                    placeholder="Please provide details about the problem you are experiencing..."
                                    className={`${inputCls} resize-none`}
                                />
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating Ticket...
                                    </>
                                ) : (
                                    <>
                                        <Send size={17} />
                                        Submit Support Ticket
                                    </>
                                )}
                            </button>

                        </form>
                    </div>


                    {/* ==========================================
                        TICKET HISTORY
                    ========================================== */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">My Support Tickets</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Track your submitted requests.</p>
                            </div>

                            <button
                                onClick={loadTickets}
                                disabled={loadingTickets}
                                aria-label="Refresh tickets"
                                title="Refresh tickets"
                                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={17}
                                    className={loadingTickets ? "animate-spin" : ""}
                                />
                            </button>
                        </div>

                        {/* LOADING */}
                        {loadingTickets && (
                            <div className="flex items-center justify-center py-16 gap-3">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-slate-500">Loading tickets...</p>
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {!loadingTickets && tickets.length === 0 && (
                            <div className="py-16 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
                                    <Ticket size={26} />
                                </div>
                                <h3 className="font-bold text-slate-900">No support tickets yet</h3>
                                <p className="text-sm text-slate-500 mt-1.5">
                                    Create a ticket if you need help.
                                </p>
                            </div>
                        )}

                        {/* TICKETS */}
                        {!loadingTickets && tickets.length > 0 && (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                                {tickets.map((ticket) => {
                                    const statusInfo = getStatusStyle(ticket.status);
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <div
                                            key={ticket.id}
                                            className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition"
                                        >
                                            {/* TOP */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                                        {formatCategory(ticket.category)}
                                                    </span>
                                                    <h3 className="font-semibold text-slate-900 mt-2 break-words">
                                                        {ticket.subject}
                                                    </h3>
                                                </div>

                                                <span
                                                    className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${statusInfo.className}`}
                                                >
                                                    <StatusIcon
                                                        size={12}
                                                        className={ticket.status === "IN_PROGRESS" ? "animate-spin" : ""}
                                                    />
                                                    {formatCategory(ticket.status)}
                                                </span>
                                            </div>

                                            {/* MESSAGE */}
                                            <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">
                                                {ticket.message}
                                            </p>

                                            {/* DATE */}
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                                                <Clock size={13} />
                                                {formatDate(ticket.createdAt)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>


                {/* ==========================================
                    SUPPORT INFO BANNER
                ========================================== */}

                <div className="flex items-start gap-3 p-5 rounded-2xl bg-blue-50 border border-blue-100">
                    <CircleHelp size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900">Need help with NEXUS?</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            Submit a support ticket with as much detail as possible. You can track the status of your request from this page.
                        </p>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );

};

export default Support;
