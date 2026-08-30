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

  const requestIdParam = searchParams.get("requestId");
  const requestId = requestIdParam ? Number(requestIdParam) : null;

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [received, sent] = await Promise.all([
        getReceivedRequests(),
        getSentRequests(),
      ]);
      setReceivedRequests(Array.isArray(received) ? received : []);
      setSentRequests(Array.isArray(sent) ? sent : []);
    } catch (error) {
      console.error("Collaboration error:", error);
      const message = error.response?.data?.message || "Unable to load collaboration requests.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (loading || !requestId) return;
    const requestExists = receivedRequests.some((r) => r.id === requestId);
    if (!requestExists) return;
    const timer = setTimeout(() => {
      const element = requestRefs.current[requestId];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRequestId(requestId);
        setTimeout(() => { setHighlightedRequestId(null); }, 4000);
      }
    }, 200);
    return () => { clearTimeout(timer); };
  }, [loading, requestId, receivedRequests]);

  const handleUpdateRequest = async (id, status) => {
    setActionLoading(id);
    try {
      const updatedRequest = await updateCollaborationRequest(id, status);
      setReceivedRequests((previous) =>
        previous.map((request) => request.id === id ? updatedRequest : request)
      );
      if (status === "ACCEPTED") {
        toast.success("Collaboration request accepted!");
      } else {
        toast.success("Collaboration request rejected.");
      }
      if (requestId === id) {
        setSearchParams({});
        setHighlightedRequestId(null);
      }
    } catch (error) {
      console.error("Update collaboration request error:", error);
      const message = error.response?.data?.message || "Unable to update collaboration request.";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRequest = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this collaboration request?");
    if (!confirmed) return;
    setActionLoading(id);
    try {
      await deleteCollaborationRequest(id);
      setSentRequests((previous) => previous.filter((r) => r.id !== id));
      toast.success("Collaboration request deleted.");
    } catch (error) {
      console.error("Delete collaboration request error:", error);
      const message = error.response?.data?.message || "Unable to delete collaboration request.";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading collaboration requests...</p>
        </div>
      </div>
    );
  }

  const pendingReceived = receivedRequests.filter((r) => r.status === "PENDING").length;
  const acceptedReceived = receivedRequests.filter((r) => r.status === "ACCEPTED").length;

  return (
    <DashboardLayout>

      {/* PAGE HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1.5">
            Collaborate
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Collaboration Hub
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-lg">
            Manage collaboration requests and build meaningful project connections with fellow students.
          </p>
        </div>

        <button
          onClick={loadRequests}
          disabled={loading}
          aria-label="Refresh collaboration requests"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Received" value={receivedRequests.length} icon={<Inbox size={20} />} iconBg="bg-blue-50 text-blue-600" valueCls="text-blue-700" />
        <SummaryCard title="Pending Action" value={pendingReceived} icon={<Clock size={20} />} iconBg="bg-amber-50 text-amber-600" valueCls="text-amber-700" />
        <SummaryCard title="Accepted" value={acceptedReceived} icon={<Check size={20} />} iconBg="bg-green-50 text-green-600" valueCls="text-green-700" />
      </section>

      {/* RECEIVED REQUESTS */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Inbox size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900">Received Requests</h2>
            <p className="text-sm text-slate-500 mt-0.5">Collaboration requests from other students.</p>
          </div>
          {receivedRequests.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold shrink-0">
              {receivedRequests.length}
            </span>
          )}
        </div>

        {receivedRequests.length === 0 ? (
          <EmptyState icon={<Inbox size={28} />} iconBg="bg-blue-50 text-blue-400" title="No received requests" description="You don't have any collaboration requests yet. Discover students and connect with them." />
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <div
                key={request.id}
                ref={(element) => { requestRefs.current[request.id] = element; }}
                className={`rounded-2xl transition-all duration-500 ${highlightedRequestId === request.id ? "ring-4 ring-blue-200 ring-offset-2" : ""}`}
              >
                <ReceivedRequestCard
                  request={request}
                  actionLoading={actionLoading}
                  onAccept={() => handleUpdateRequest(request.id, "ACCEPTED")}
                  onReject={() => handleUpdateRequest(request.id, "REJECTED")}
                  formatDate={formatDate}
                  highlighted={highlightedRequestId === request.id}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SENT REQUESTS */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Send size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900">Sent Requests</h2>
            <p className="text-sm text-slate-500 mt-0.5">Collaboration requests you have sent to other students.</p>
          </div>
          {sentRequests.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold shrink-0">
              {sentRequests.length}
            </span>
          )}
        </div>

        {sentRequests.length === 0 ? (
          <EmptyState icon={<Send size={28} />} iconBg="bg-purple-50 text-purple-400" title="No sent requests" description="You haven't sent any collaboration requests yet. Find students to collaborate with." />
        ) : (
          <div className="space-y-4">
            {sentRequests.map((request) => (
              <SentRequestCard
                key={request.id}
                request={request}
                actionLoading={actionLoading}
                onDelete={() => handleDeleteRequest(request.id)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </section>

    </DashboardLayout>
  );
};

// ==========================================
// SUMMARY CARD
// ==========================================

const SummaryCard = ({ title, value, icon, iconBg = "bg-blue-50 text-blue-600", valueCls = "text-slate-900" }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-bold mt-2 ${valueCls}`}>{value}</p>
      </div>
      <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
    </div>
  </div>
);

// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({ status }) => {
  if (status === "ACCEPTED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-semibold whitespace-nowrap">
        <Check size={12} /> Accepted
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold whitespace-nowrap">
        <X size={12} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold whitespace-nowrap">
      <Clock size={12} /> Pending
    </span>
  );
};

// ==========================================
// RECEIVED REQUEST CARD
// ==========================================

const ReceivedRequestCard = ({ request, actionLoading, onAccept, onReject, formatDate, highlighted }) => {
  const isPending = request.status === "PENDING";
  const isLoading = actionLoading === request.id;
  const initials = request.senderName
    ? request.senderName.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className={`border rounded-2xl p-5 transition-all ${highlighted ? "border-blue-300 bg-blue-50/30 shadow-sm" : "border-slate-200 hover:shadow-sm hover:border-slate-300"}`}>
      {highlighted && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          <MessageSquare size={13} />
          New collaboration request
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-sm font-bold shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900">{request.senderName}</h3>
            {request.projectTitle && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                <FolderKanban size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{request.projectTitle}</span>
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {request.message && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            <MessageSquare size={13} />
            Message
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{request.message}</p>
        </div>
      )}

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">Received on {formatDate(request.createdAt)}</p>
        {isPending && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onReject}
              disabled={isLoading}
              aria-label="Reject collaboration request"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
            >
              <X size={15} />
              Reject
            </button>
            <button
              onClick={onAccept}
              disabled={isLoading}
              aria-label="Accept collaboration request"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              <Check size={15} />
              {isLoading ? "Updating..." : "Accept"}
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

const SentRequestCard = ({ request, actionLoading, onDelete, formatDate }) => {
  const isLoading = actionLoading === request.id;
  const initials = request.receiverName
    ? request.receiverName.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="border border-slate-200 rounded-2xl p-5 hover:shadow-sm hover:border-slate-300 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center text-sm font-bold shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">To</p>
            <h3 className="text-base font-bold text-slate-900">{request.receiverName}</h3>
            {request.projectTitle && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                <FolderKanban size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{request.projectTitle}</span>
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {request.message && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            <MessageSquare size={13} />
            Message
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{request.message}</p>
        </div>
      )}

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">Sent on {formatDate(request.createdAt)}</p>
        <button
          onClick={onDelete}
          disabled={isLoading}
          aria-label="Delete collaboration request"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
        >
          <Trash2 size={15} />
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// EMPTY STATE
// ==========================================

const EmptyState = ({ icon, title, description, iconBg = "bg-slate-50 text-slate-400" }) => (
  <div className="py-14 text-center">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${iconBg}`}>
      {icon}
    </div>
    <h3 className="text-base font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">{description}</p>
  </div>
);

export default Collaboration;
