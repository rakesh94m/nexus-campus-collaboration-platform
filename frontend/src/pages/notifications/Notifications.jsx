import { useEffect, useMemo, useState } from "react";

import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  Inbox,
  UserPlus,
  UserCheck,
  UserX,
  Sparkles,
  Settings,
  Clock,
} from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getNotifications,
  updateNotification,
  deleteNotification,
} from "../../services/notificationService";

// ==========================================
// NOTIFICATIONS PAGE
// ==========================================

const Notifications = () => {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [markingAll, setMarkingAll] = useState(false);

  const [filter, setFilter] = useState("ALL");

  // =========================================
  // LOAD NOTIFICATIONS
  // =========================================

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await getNotifications();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Notifications error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to load notifications.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadNotifications();
  }, []);

  // =========================================
  // UNREAD COUNT
  // =========================================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) =>
        notification.status === "UNREAD"
    ).length;
  }, [notifications]);

  // =========================================
  // FILTERED NOTIFICATIONS
  // =========================================

  const filteredNotifications = useMemo(() => {
    if (filter === "UNREAD") {
      return notifications.filter(
        (notification) =>
          notification.status === "UNREAD"
      );
    }

    if (filter === "READ") {
      return notifications.filter(
        (notification) =>
          notification.status === "READ"
      );
    }

    return notifications;
  }, [notifications, filter]);

  // =========================================
  // MARK SINGLE NOTIFICATION AS READ
  // =========================================

  const handleMarkAsRead = async (notification) => {
    if (notification.status === "READ") {
      return;
    }

    setActionLoading(notification.id);

    try {
      const updatedNotification =
        await updateNotification(
          notification.id,
          "READ"
        );

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? updatedNotification
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to update notification.";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================
  // OPEN NOTIFICATION
  // =========================================

  const handleOpenNotification = async (
    notification
  ) => {
    /*
     * Collaboration notifications use referenceId
     * to store the CollaborationRequest ID.
     *
     * Example:
     * PROJECT_INVITE -> referenceId = request ID
     */

    const collaborationTypes = [
      "PROJECT_INVITE",
      "REQUEST_ACCEPTED",
      "REQUEST_REJECTED",
    ];

    if (
      collaborationTypes.includes(
        notification.type
      ) &&
      notification.referenceId
    ) {
      try {
        // Mark unread notification as read
        if (notification.status === "UNREAD") {
          const updatedNotification =
            await updateNotification(
              notification.id,
              "READ"
            );

          setNotifications((previous) =>
            previous.map((item) =>
              item.id === notification.id
                ? updatedNotification
                : item
            )
          );
        }

        // Go directly to the collaboration request
        navigate(
          `/collaboration?requestId=${notification.referenceId}`
        );
      } catch (error) {
        console.error(
          "Open notification error:",
          error
        );

        /*
         * Even if marking as read fails,
         * still allow the user to open
         * the related collaboration request.
         */
        navigate(
          `/collaboration?requestId=${notification.referenceId}`
        );
      }

      return;
    }

    // For notifications without navigation target,
    // simply mark them as read.
    await handleMarkAsRead(notification);
  };

  // =========================================
  // MARK ALL AS READ
  // =========================================

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      toast.success(
        "All notifications are already read."
      );

      return;
    }

    setMarkingAll(true);

    try {
      const unreadNotifications =
        notifications.filter(
          (notification) =>
            notification.status === "UNREAD"
        );

      const updatedNotifications =
        await Promise.all(
          unreadNotifications.map(
            async (notification) => {
              return await updateNotification(
                notification.id,
                "READ"
              );
            }
          )
        );

      setNotifications((previous) =>
        previous.map((notification) => {
          const updated =
            updatedNotifications.find(
              (item) =>
                item.id === notification.id
            );

          return updated || notification;
        })
      );

      toast.success(
        "All notifications marked as read."
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to mark all notifications as read.";

      toast.error(message);
    } finally {
      setMarkingAll(false);
    }
  };

  // =========================================
  // DELETE NOTIFICATION
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(id);

    try {
      await deleteNotification(id);

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification.id !== id
        )
      );

      toast.success(
        "Notification deleted."
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to delete notification.";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
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

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =========================================
  // NOTIFICATION TYPE DETAILS
  // =========================================

  const getNotificationDetails = (type) => {
    switch (type) {
      case "PROJECT_INVITE":
        return {
          icon: <UserPlus size={21} />,
          title: "Project Invitation",
          bg: "bg-blue-50",
          text: "text-blue-600",
        };

      case "REQUEST_ACCEPTED":
        return {
          icon: <UserCheck size={21} />,
          title: "Request Accepted",
          bg: "bg-green-50",
          text: "text-green-600",
        };

      case "REQUEST_REJECTED":
        return {
          icon: <UserX size={21} />,
          title: "Request Rejected",
          bg: "bg-red-50",
          text: "text-red-600",
        };

      case "MATCH_FOUND":
        return {
          icon: <Sparkles size={21} />,
          title: "Match Found",
          bg: "bg-purple-50",
          text: "text-purple-600",
        };

      case "SYSTEM":
        return {
          icon: <Settings size={21} />,
          title: "System Notification",
          bg: "bg-slate-100",
          text: "text-slate-600",
        };

      default:
        return {
          icon: <Bell size={21} />,
          title: "Notification",
          bg: "bg-blue-50",
          text: "text-blue-600",
        };
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <DashboardLayout>
        <div
          className="
            min-h-[70vh]
            flex
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                w-10
                h-10
                border-4
                border-blue-600
                border-t-transparent
                rounded-full
                animate-spin
                mx-auto
                mb-4
              "
            />

            <p
              className="
                text-slate-600
                font-medium
              "
            >
              Loading notifications...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <DashboardLayout>
      {/* ======================================
          PAGE HEADER
      ====================================== */}

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
            Campus Updates
          </p>

          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Notifications
          </h1>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            Stay updated with your projects,
            collaboration requests and matches.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadNotifications}
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

          <button
            onClick={handleMarkAllAsRead}
            disabled={
              markingAll ||
              unreadCount === 0
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-blue-600
              text-white
              text-sm
              font-semibold
              hover:bg-blue-700
              transition
              disabled:opacity-50
            "
          >
            <CheckCheck size={17} />

            {markingAll
              ? "Updating..."
              : "Mark All Read"}
          </button>
        </div>
      </section>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          mb-6
        "
      >
        <NotificationSummaryCard
          title="Total"
          value={notifications.length}
          icon={<Inbox size={21} />}
        />

        <NotificationSummaryCard
          title="Unread"
          value={unreadCount}
          icon={<Bell size={21} />}
        />

        <NotificationSummaryCard
          title="Read"
          value={
            notifications.length -
            unreadCount
          }
          icon={<Check size={21} />}
        />
      </section>

      {/* ======================================
          FILTERS
      ====================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-4
          mb-6
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <FilterButton
            label="All"
            active={filter === "ALL"}
            onClick={() =>
              setFilter("ALL")
            }
            count={notifications.length}
          />

          <FilterButton
            label="Unread"
            active={filter === "UNREAD"}
            onClick={() =>
              setFilter("UNREAD")
            }
            count={unreadCount}
          />

          <FilterButton
            label="Read"
            active={filter === "READ"}
            onClick={() =>
              setFilter("READ")
            }
            count={
              notifications.length -
              unreadCount
            }
          />
        </div>
      </section>

      {/* ======================================
          NOTIFICATIONS
      ====================================== */}

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
              bg-blue-50
              text-blue-600
            "
          >
            <Bell size={21} />
          </div>

          <div>
            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Your Notifications
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Recent updates and activity
              from Nexus.
            </p>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(
              (notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  actionLoading={
                    actionLoading
                  }
                  onOpen={
                    handleOpenNotification
                  }
                  onMarkAsRead={
                    handleMarkAsRead
                  }
                  onDelete={handleDelete}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getNotificationDetails={
                    getNotificationDetails
                  }
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

const NotificationSummaryCard = ({
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
          <p
            className="
              text-sm
              text-slate-500
            "
          >
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
// FILTER BUTTON
// ==========================================

const FilterButton = ({
  label,
  active,
  onClick,
  count,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        text-sm
        font-semibold
        transition
        ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
        }
      `}
    >
      {label}

      <span
        className={`
          min-w-[22px]
          h-[22px]
          px-1.5
          rounded-full
          flex
          items-center
          justify-center
          text-xs
          ${
            active
              ? "bg-white/20 text-white"
              : "bg-white text-slate-500"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
};

// ==========================================
// NOTIFICATION CARD
// ==========================================

const NotificationCard = ({
  notification,
  actionLoading,
  onOpen,
  onMarkAsRead,
  onDelete,
  formatDate,
  formatTime,
  getNotificationDetails,
}) => {
  const isUnread =
    notification.status === "UNREAD";

  const isLoading =
    actionLoading === notification.id;

  const details =
    getNotificationDetails(
      notification.type
    );

  const isClickable =
    [
      "PROJECT_INVITE",
      "REQUEST_ACCEPTED",
      "REQUEST_REJECTED",
    ].includes(notification.type) &&
    !!notification.referenceId;

  return (
    <div
      onClick={() => {
        if (!isLoading) {
          onOpen(notification);
        }
      }}
      className={`
        relative
        border
        rounded-2xl
        p-5
        transition

        ${
          isUnread
            ? "border-blue-200 bg-blue-50/30"
            : "border-slate-200 bg-white"
        }

        hover:shadow-sm

        ${
          isClickable
            ? "cursor-pointer hover:border-blue-300"
            : ""
        }
      `}
    >
      {/* ====================================
          UNREAD INDICATOR
      ==================================== */}

      {isUnread && (
        <div
          className="
            absolute
            top-5
            right-5
            w-2.5
            h-2.5
            rounded-full
            bg-blue-600
          "
        />
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
        {/* ==================================
            LEFT SIDE
        ================================== */}

        <div
          className="
            flex
            items-start
            gap-4
            min-w-0
          "
        >
          <div
            className={`
              w-12
              h-12
              rounded-xl
              flex
              items-center
              justify-center
              shrink-0
              ${details.bg}
              ${details.text}
            `}
          >
            {details.icon}
          </div>

          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <h3
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                {details.title}
              </h3>

              {isUnread && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-2
                    py-1
                    rounded-full
                    bg-blue-100
                    text-blue-700
                    text-[11px]
                    font-semibold
                  "
                >
                  <Bell size={11} />

                  New
                </span>
              )}
            </div>

            <p
              className="
                mt-2
                text-sm
                text-slate-700
                leading-relaxed
                max-w-3xl
              "
            >
              {notification.message}
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
                mt-3
                text-xs
                text-slate-400
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <Clock size={13} />

                {formatDate(
                  notification.createdAt
                )}
              </span>

              <span>
                {formatTime(
                  notification.createdAt
                )}
              </span>

              {isClickable && (
                <span
                  className="
                    text-blue-600
                    font-medium
                  "
                >
                  Click to view request →
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ==================================
            ACTIONS
        ================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            shrink-0
          "
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {isUnread && (
            <button
              onClick={() =>
                onMarkAsRead(
                  notification
                )
              }
              disabled={isLoading}
              title="Mark as read"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-3
                py-2
                rounded-lg
                border
                border-green-200
                text-green-600
                text-sm
                font-semibold
                hover:bg-green-50
                transition
                disabled:opacity-50
              "
            >
              <Check size={16} />

              <span className="hidden sm:inline">
                Read
              </span>
            </button>
          )}

          <button
            onClick={() =>
              onDelete(
                notification.id
              )
            }
            disabled={isLoading}
            title="Delete notification"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-3
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

            <span className="hidden sm:inline">
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// EMPTY STATE
// ==========================================

const EmptyState = ({ filter }) => {
  let title = "No notifications yet";

  let description =
    "You don't have any notifications at the moment.";

  if (filter === "UNREAD") {
    title = "No unread notifications";

    description =
      "You're all caught up! There are no unread notifications.";
  }

  if (filter === "READ") {
    title = "No read notifications";

    description =
      "You haven't marked any notifications as read yet.";
  }

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
        <Inbox size={30} />
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

export default Notifications;