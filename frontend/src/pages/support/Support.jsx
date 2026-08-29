import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    CircleHelp,
    Send,
    Ticket,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
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

    const [category, setCategory] =
        useState("GENERAL");

    const [subject, setSubject] =
        useState("");

    const [message, setMessage] =
        useState("");


    // ==========================================
    // TICKETS STATE
    // ==========================================

    const [tickets, setTickets] =
        useState([]);

    const [loadingTickets, setLoadingTickets] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);


    // ==========================================
    // LOAD SUPPORT TICKETS
    // ==========================================

    const loadTickets = async () => {

        try {

            setLoadingTickets(true);

            const data =
                await getMySupportTickets();

            setTickets(data);

        } catch (error) {

            console.error(
                "Failed to load support tickets:",
                error
            );

            toast.error(
                "Failed to load support tickets."
            );

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

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        // Basic frontend validation

        if (!category) {

            toast.error(
                "Please select a category."
            );

            return;

        }


        if (!subject.trim()) {

            toast.error(
                "Please enter a subject."
            );

            return;

        }


        if (!message.trim()) {

            toast.error(
                "Please describe your issue."
            );

            return;

        }


        try {

            setSubmitting(true);


            const ticketData = {

                category: category,

                subject: subject.trim(),

                message: message.trim(),

            };


            const createdTicket =
                await createSupportTicket(
                    ticketData
                );


            // Add newly created ticket
            // to the top immediately

            setTickets(
                (previousTickets) => [
                    createdTicket,
                    ...previousTickets,
                ]
            );


            // Reset form

            setCategory(
                "GENERAL"
            );

            setSubject(
                ""
            );

            setMessage(
                ""
            );


            toast.success(
                "Support ticket created successfully!"
            );

        } catch (error) {

            console.error(
                "Failed to create support ticket:",
                error
            );


            const errorMessage =
                error?.response?.data?.message ||
                "Failed to create support ticket.";


            toast.error(
                errorMessage
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ==========================================
    // FORMAT CATEGORY
    // ==========================================

    const formatCategory = (
        category
    ) => {

        if (!category) {
            return "General";
        }

        return category
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (
        dateValue
    ) => {

        if (!dateValue) {
            return "";
        }

        return new Date(
            dateValue
        ).toLocaleString();

    };


    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (
        status
    ) => {

        switch (status) {

            case "RESOLVED":

                return {
                    icon: CheckCircle2,
                    className:
                        "bg-green-50 text-green-700 border-green-200",
                };


            case "IN_PROGRESS":

                return {
                    icon: Loader2,
                    className:
                        "bg-blue-50 text-blue-700 border-blue-200",
                };


            case "CLOSED":

                return {
                    icon: CheckCircle2,
                    className:
                        "bg-slate-100 text-slate-700 border-slate-200",
                };


            case "OPEN":

            default:

                return {
                    icon: Clock,
                    className:
                        "bg-amber-50 text-amber-700 border-amber-200",
                };

        }

    };


    return (

        <DashboardLayout>

            <div
                className="
          max-w-6xl
          mx-auto
          space-y-8
        "
            >


                {/* ==========================================
            PAGE HEADER
        ========================================== */}

                <div>

                    <div className="flex items-center gap-3">

                        <div
                            className="
                w-12
                h-12
                rounded-xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
              "
                        >

                            <CircleHelp size={25} />

                        </div>


                        <div>

                            <h1
                                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
                            >
                                Help & Support
                            </h1>


                            <p
                                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
                            >
                                Create a support ticket and track
                                your requests.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==========================================
            MAIN GRID
        ========================================== */}

                <div
                    className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
          "
                >


                    {/* ==========================================
              CREATE TICKET
          ========================================== */}

                    <div
                        className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
              shadow-sm
            "
                    >

                        <div
                            className="
                flex
                items-center
                gap-3
                mb-6
              "
                        >

                            <Ticket
                                size={21}
                                className="text-blue-600"
                            />

                            <div>

                                <h2
                                    className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                                >
                                    Create Support Ticket
                                </h2>

                                <p
                                    className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                                >
                                    Tell us what issue you are facing.
                                </p>

                            </div>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            {/* CATEGORY */}

                            <div>

                                <label
                                    className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    mb-2
                  "
                                >
                                    Category
                                </label>


                                <select
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(
                                            event.target.value
                                        )
                                    }
                                    className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                  "
                                >

                                    <option value="GENERAL">
                                        General Question
                                    </option>

                                    <option value="ACCOUNT_ISSUE">
                                        Account Issue
                                    </option>

                                    <option value="BUG_REPORT">
                                        Bug Report
                                    </option>

                                    <option value="TECHNICAL_ISSUE">
                                        Technical Issue
                                    </option>

                                    <option value="FEATURE_REQUEST">
                                        Feature Request
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* SUBJECT */}

                            <div>

                                <label
                                    className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    mb-2
                  "
                                >
                                    Subject
                                </label>


                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(event) =>
                                        setSubject(
                                            event.target.value
                                        )
                                    }
                                    maxLength={150}
                                    placeholder="Briefly describe your issue"
                                    className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                  "
                                />

                            </div>


                            {/* MESSAGE */}

                            <div>

                                <label
                                    className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    mb-2
                  "
                                >
                                    Describe your issue
                                </label>


                                <textarea
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(
                                            event.target.value
                                        )
                                    }
                                    maxLength={5000}
                                    rows={6}
                                    placeholder="
                    Please provide details about
                    the problem you are experiencing...
                  "
                                    className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    outline-none
                    resize-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                  "
                                />

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-3
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-semibold
                  hover:bg-blue-700
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
                            >

                                {submitting ? (

                                    <>

                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Creating Ticket...

                                    </>

                                ) : (

                                    <>

                                        <Send size={18} />

                                        Submit Support Ticket

                                    </>

                                )}

                            </button>

                        </form>

                    </div>


                    {/* ==========================================
              TICKET HISTORY
          ========================================== */}

                    <div
                        className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
              shadow-sm
            "
                    >


                        {/* HEADER */}

                        <div
                            className="
                flex
                items-center
                justify-between
                mb-6
              "
                        >

                            <div>

                                <h2
                                    className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                                >
                                    My Support Tickets
                                </h2>

                                <p
                                    className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                                >
                                    Track your submitted requests.
                                </p>

                            </div>


                            <button
                                onClick={loadTickets}
                                disabled={loadingTickets}
                                className="
                  p-2.5
                  rounded-xl
                  border
                  border-slate-200
                  hover:bg-slate-50
                  transition
                "
                                title="Refresh tickets"
                            >

                                <RefreshCw
                                    size={18}
                                    className={
                                        loadingTickets
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                            </button>

                        </div>


                        {/* LOADING */}

                        {loadingTickets && (

                            <div
                                className="
                  flex
                  items-center
                  justify-center
                  py-16
                  text-slate-500
                "
                            >

                                <Loader2
                                    size={24}
                                    className="
                    animate-spin
                    mr-3
                  "
                                />

                                Loading tickets...

                            </div>

                        )}


                        {/* EMPTY STATE */}

                        {!loadingTickets &&
                            tickets.length === 0 && (

                                <div
                                    className="
                  py-16
                  text-center
                "
                                >

                                    <Ticket
                                        size={40}
                                        className="
                    mx-auto
                    text-slate-300
                    mb-3
                  "
                                    />

                                    <p
                                        className="
                    font-medium
                    text-slate-700
                  "
                                    >
                                        No support tickets yet
                                    </p>

                                    <p
                                        className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                                    >
                                        Create a ticket if you need help.
                                    </p>

                                </div>

                            )}


                        {/* TICKETS */}

                        {!loadingTickets &&
                            tickets.length > 0 && (

                                <div
                                    className="
                  space-y-4
                  max-h-[650px]
                  overflow-y-auto
                  pr-1
                "
                                >

                                    {tickets.map(
                                        (ticket) => {

                                            const statusInfo =
                                                getStatusStyle(
                                                    ticket.status
                                                );

                                            const StatusIcon =
                                                statusInfo.icon;


                                            return (

                                                <div
                                                    key={ticket.id}
                                                    className="
                          border
                          border-slate-200
                          rounded-xl
                          p-4
                          hover:border-slate-300
                          transition
                        "
                                                >


                                                    {/* TOP */}

                                                    <div
                                                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                                                    >

                                                        <div>

                            <span
                                className="
                                text-xs
                                font-medium
                                text-blue-600
                              "
                            >
                              {formatCategory(
                                  ticket.category
                              )}
                            </span>


                                                            <h3
                                                                className="
                                font-semibold
                                text-slate-900
                                mt-1
                              "
                                                            >
                                                                {ticket.subject}
                                                            </h3>

                                                        </div>


                                                        <span
                                                            className={`
                              shrink-0
                              flex
                              items-center
                              gap-1.5
                              px-2.5
                              py-1
                              rounded-full
                              border
                              text-xs
                              font-semibold
                              ${statusInfo.className}
                            `}
                                                        >

                            <StatusIcon
                                size={13}
                                className={
                                    ticket.status ===
                                    "IN_PROGRESS"
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                                                            {formatCategory(
                                                                ticket.status
                                                            )}

                          </span>

                                                    </div>


                                                    {/* MESSAGE */}

                                                    <p
                                                        className="
                            text-sm
                            text-slate-600
                            mt-3
                            leading-relaxed
                            line-clamp-3
                          "
                                                    >
                                                        {ticket.message}
                                                    </p>


                                                    {/* DATE */}

                                                    <div
                                                        className="
                            flex
                            items-center
                            gap-2
                            mt-4
                            pt-3
                            border-t
                            border-slate-100
                            text-xs
                            text-slate-500
                          "
                                                    >

                                                        <Clock size={14} />

                                                        {formatDate(
                                                            ticket.createdAt
                                                        )}

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                    </div>

                </div>


                {/* ==========================================
            SUPPORT INFO
        ========================================== */}

                <div
                    className="
            flex
            items-start
            gap-3
            p-5
            rounded-2xl
            bg-blue-50
            border
            border-blue-100
          "
                >

                    <AlertCircle
                        size={21}
                        className="
              text-blue-600
              shrink-0
              mt-0.5
            "
                    />

                    <div>

                        <h3
                            className="
                font-semibold
                text-blue-900
              "
                        >
                            Need help with NEXUS?
                        </h3>

                        <p
                            className="
                text-sm
                text-blue-700
                mt-1
              "
                        >
                            Submit a support ticket with as much
                            detail as possible. You can track the
                            status of your request from this page.
                        </p>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

};


export default Support;