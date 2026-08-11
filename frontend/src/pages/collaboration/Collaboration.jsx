import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Users,
  Inbox,
  Send,
  Check,
  X,
  Trash2,
  Clock,
  FolderKanban,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  useSearchParams,
} from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getReceivedRequests,
  getSentRequests,
  updateCollaborationRequest,
  deleteCollaborationRequest,
} from "../../services/collaborationService";

const Collaboration = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [receivedRequests, setReceivedRequests] =
    useState([]);

  const [sentRequests, setSentRequests] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [highlightedRequestId, setHighlightedRequestId] =
    useState(null);

  const requestRefs = useRef({});

  // ==========================================
  // REQUEST ID FROM NOTIFICATION
  // ==========================================

  const requestIdParam =
    searchParams.get("requestId");

  const requestId = requestIdParam
    ? Number(requestIdParam)
    : null;

  // ==========================================
  // LOAD REQUESTS
  // ==========================================

  const loadRequests = async () => {
    try {
      setLoading(true);

      const [received, sent] =
        await Promise.all([
          getReceivedRequests(),
          getSentRequests(),
        ]);

      setReceivedRequests(
        Array.isArray(received)
          ? received
          : []
      );

      setSentRequests(
        Array.isArray(sent)
          ? sent
          : []
      );
    } catch (error) {
      console.error(
        "Collaboration error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to load collaboration requests.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ==========================================
  // SCROLL TO REQUEST FROM NOTIFICATION
  // ==========================================

  useEffect(() => {
    if (
      loading ||
      !requestId
    ) {
      return;
    }

    const requestExists =
      receivedRequests.some(
        (request) =>
          request.id === requestId
      );

    if (!requestExists) {
      return;
    }

    /*
     * Small timeout ensures the DOM card
     * has been rendered before scrolling.
     */

    const timer = setTimeout(() => {
      const element =
        requestRefs.current[
          requestId
        ];

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setHighlightedRequestId(
          requestId
        );

        /*
         * Remove highlight after 4 seconds.
         */

        setTimeout(() => {
          setHighlightedRequestId(null);
        }, 4000);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [
    loading,
    requestId,
    receivedRequests,
  ]);

  // ==========================================
  // ACCEPT / REJECT REQUEST
  // ==========================================

  const handleUpdateRequest = async (
    id,
    status
  ) => {
    setActionLoading(id);

    try {
      const updatedRequest =
        await updateCollaborationRequest(
          id,
          status
        );

      setReceivedRequests((previous) =>
        previous.map((request) =>
          request.id === id
            ? updatedRequest
            : request
        )
      );

      if (status === "ACCEPTED") {
        toast.success(
          "Collaboration request accepted!"
        );
      } else {
        toast.success(
          "Collaboration request rejected."
        );
      }

      /*
       * Remove requestId from URL after
       * processing the request.
       */

      if (requestId === id) {
        setSearchParams({});
        setHighlightedRequestId(null);
      }
    } catch (error) {
      console.error(
        "Update collaboration request error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to update collaboration request.";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DELETE SENT REQUEST
  // ==========================================

  const handleDeleteRequest = async (
    id
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collaboration request?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(id);

    try {
      await deleteCollaborationRequest(id);

      setSentRequests((previous) =>
        previous.filter(
          (request) =>
            request.id !== id
        )
      );

      toast.success(
        "Collaboration request deleted."
      );
    } catch (error) {
      console.error(
        "Delete collaboration request error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to delete collaboration request.";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-50
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-10 h-10
              border-4
              border-blue-600
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              mb-4
            "
          />

          <p className="text-slate-600 font-medium">
            Loading collaboration requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <section
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
          mb-8
        "
      >
        <div>
          <p
            className="
              text-sm
              font-medium
              text-blue-600
              mb-1
            "
          >
            Campus Collaboration
          </p>

          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Collaboration
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your collaboration requests
            and connect with fellow students.
          </p>
        </div>

        <button
          onClick={loadRequests}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            border
            border-slate-300
            bg-white
            text-slate-700
            text-sm
            font-semibold
            hover:bg-slate-50
            transition
            disabled:opacity-50
          "
        >
          <RefreshCw size={16} />

          Refresh
        </button>
      </section>

      {/* ==========================================
          SUMMARY
      ========================================== */}

      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          mb-6
        "
      >
        <SummaryCard
          title="Received"
          value={receivedRequests.length}
          icon={<Inbox size={21} />}
        />

        <SummaryCard
          title="Sent"
          value={sentRequests.length}
          icon={<Send size={21} />}
        />

        <SummaryCard
          title="Accepted"
          value={
            receivedRequests.filter(
              (request) =>
                request.status ===
                "ACCEPTED"
            ).length
          }
          icon={<Check size={21} />}
        />
      </section>

      {/* ==========================================
          RECEIVED REQUESTS
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
          mb-6
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
          <div
            className="
              p-3
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Inbox size={21} />
          </div>

          <div>
            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Received Requests
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Collaboration requests from other
              students.
            </p>
          </div>
        </div>

        {receivedRequests.length === 0 ? (
          <EmptyState
            icon={<Inbox size={30} />}
            title="No collaboration requests"
            description="You don't have any received collaboration requests yet."
          />
        ) : (
          <div className="space-y-4">
            {receivedRequests.map(
              (request) => (
                <div
                  key={request.id}
                  ref={(element) => {
                    requestRefs.current[
                      request.id
                    ] = element;
                  }}
                  className={`
                    rounded-2xl
                    transition-all
                    duration-500
                    ${
                      highlightedRequestId ===
                      request.id
                        ? "ring-4 ring-blue-200 ring-offset-2"
                        : ""
                    }
                  `}
                >
                  <ReceivedRequestCard
                    request={request}
                    actionLoading={
                      actionLoading
                    }
                    onAccept={() =>
                      handleUpdateRequest(
                        request.id,
                        "ACCEPTED"
                      )
                    }
                    onReject={() =>
                      handleUpdateRequest(
                        request.id,
                        "REJECTED"
                      )
                    }
                    formatDate={
                      formatDate
                    }
                    highlighted={
                      highlightedRequestId ===
                      request.id
                    }
                  />
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ==========================================
          SENT REQUESTS
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
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
          <div
            className="
              p-3
              rounded-xl
              bg-purple-50
              text-purple-600
            "
          >
            <Send size={21} />
          </div>

          <div>
            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Sent Requests
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Collaboration requests you have sent.
            </p>
          </div>
        </div>

        {sentRequests.length === 0 ? (
          <EmptyState
            icon={<Send size={30} />}
            title="No sent requests"
            description="You haven't sent any collaboration requests yet."
          />
        ) : (
          <div className="space-y-4">
            {sentRequests.map(
              (request) => (
                <SentRequestCard
                  key={request.id}
                  request={request}
                  actionLoading={
                    actionLoading
                  }
                  onDelete={() =>
                    handleDeleteRequest(
                      request.id
                    )
                  }
                  formatDate={formatDate}
                />
              )
            )}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

// ==========================================
// SUMMARY CARD
// ==========================================

const SummaryCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        p-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-slate-900
              mt-2
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            p-3
            rounded-xl
            bg-blue-50
            text-blue-600
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({ status }) => {
  if (status === "ACCEPTED") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          px-3
          py-1.5
          rounded-full
          bg-green-50
          text-green-700
          text-xs
          font-semibold
        "
      >
        <Check size={14} />

        Accepted
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          px-3
          py-1.5
          rounded-full
          bg-red-50
          text-red-700
          text-xs
          font-semibold
        "
      >
        <X size={14} />

        Rejected
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        px-3
        py-1.5
        rounded-full
        bg-amber-50
        text-amber-700
        text-xs
        font-semibold
      "
    >
      <Clock size={14} />

      Pending
    </span>
  );
};

// ==========================================
// RECEIVED REQUEST CARD
// ==========================================

const ReceivedRequestCard = ({
  request,
  actionLoading,
  onAccept,
  onReject,
  formatDate,
  highlighted,
}) => {
  const isPending =
    request.status === "PENDING";

  const isLoading =
    actionLoading === request.id;

  return (
    <div
      className={`
        border
        rounded-2xl
        p-5
        transition
        ${
          highlighted
            ? "border-blue-400 bg-blue-50/40 shadow-md"
            : "border-slate-200 hover:shadow-sm"
        }
      `}
    >
      {highlighted && (
        <div
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            bg-blue-100
            text-blue-700
            text-xs
            font-semibold
          "
        >
          <MessageSquare size={14} />

          Collaboration request
        </div>
      )}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-start
          justify-between
          gap-4
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Users size={22} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-base
                font-bold
                text-slate-900
              "
            >
              {request.senderName}
            </h3>

            <div
              className="
                flex
                items-center
                gap-2
                mt-1
                text-sm
                text-slate-500
              "
            >
              <FolderKanban size={15} />

              <span>
                {request.projectTitle}
              </span>
            </div>
          </div>
        </div>

        <StatusBadge
          status={request.status}
        />
      </div>

      {request.message && (
        <div
          className="
            mt-5
            p-4
            rounded-xl
            bg-slate-50
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-slate-500
              mb-2
            "
          >
            <MessageSquare size={14} />

            Message
          </div>

          <p
            className="
              text-sm
              text-slate-700
              leading-relaxed
            "
          >
            {request.message}
          </p>
        </div>
      )}

      <div
        className="
          mt-5
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-xs
            text-slate-400
          "
        >
          Received on{" "}
          {formatDate(
            request.createdAt
          )}
        </p>

        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={onReject}
              disabled={isLoading}
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                border
                border-red-200
                text-red-600
                text-sm
                font-semibold
                hover:bg-red-50
                transition
                disabled:opacity-50
              "
            >
              <X size={16} />

              Reject
            </button>

            <button
              onClick={onAccept}
              disabled={isLoading}
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-green-600
                text-white
                text-sm
                font-semibold
                hover:bg-green-700
                transition
                disabled:opacity-50
              "
            >
              <Check size={16} />

              {isLoading
                ? "Updating..."
                : "Accept"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// SENT REQUEST CARD
// ==========================================

const SentRequestCard = ({
  request,
  actionLoading,
  onDelete,
  formatDate,
}) => {
  const isLoading =
    actionLoading === request.id;

  return (
    <div
      className="
        border
        border-slate-200
        rounded-2xl
        p-5
        hover:shadow-sm
        transition
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-start
          justify-between
          gap-4
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-purple-50
              text-purple-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Send size={21} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-base
                font-bold
                text-slate-900
              "
            >
              To: {request.receiverName}
            </h3>

            <div
              className="
                flex
                items-center
                gap-2
                mt-1
                text-sm
                text-slate-500
              "
            >
              <FolderKanban size={15} />

              <span>
                {request.projectTitle}
              </span>
            </div>
          </div>
        </div>

        <StatusBadge
          status={request.status}
        />
      </div>

      {request.message && (
        <div
          className="
            mt-5
            p-4
            rounded-xl
            bg-slate-50
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-slate-500
              mb-2
            "
          >
            <MessageSquare size={14} />

            Message
          </div>

          <p
            className="
              text-sm
              text-slate-700
              leading-relaxed
            "
          >
            {request.message}
          </p>
        </div>
      )}

      <div
        className="
          mt-5
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-xs
            text-slate-400
          "
        >
          Sent on{" "}
          {formatDate(
            request.createdAt
          )}
        </p>

        <button
          onClick={onDelete}
          disabled={isLoading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            border-red-200
            text-red-600
            text-sm
            font-semibold
            hover:bg-red-50
            transition
            disabled:opacity-50
          "
        >
          <Trash2 size={16} />

          {isLoading
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// EMPTY STATE
// ==========================================

const EmptyState = ({
  icon,
  title,
  description,
}) => {
  return (
    <div
      className="
        py-14
        text-center
        border
        border-dashed
        border-slate-200
        rounded-2xl
      "
    >
      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-slate-50
          text-slate-400
          flex
          items-center
          justify-center
          mx-auto
          mb-4
        "
      >
        {icon}
      </div>

      <h3
        className="
          text-base
          font-bold
          text-slate-900
        "
      >
        {title}
      </h3>

      <p
        className="
          text-sm
          text-slate-500
          mt-2
          max-w-md
          mx-auto
        "
      >
        {description}
      </p>
    </div>
  );
};

export default Collaboration;