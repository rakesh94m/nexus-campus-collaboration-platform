import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { getNotifications } from "../../services/notificationService";

const DashboardLayout = ({ children }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notificationCount, setNotificationCount] =
    useState(0);


  // ==========================================
  // LOAD NOTIFICATION COUNT
  // ==========================================

  const loadNotificationCount = async () => {

    try {

      const notifications =
        await getNotifications();

      const unreadCount =
        notifications.filter(
          (notification) =>
            notification.status === "UNREAD"
        ).length;

      setNotificationCount(unreadCount);

    } catch (error) {

      console.error(
        "Notification count error:",
        error
      );

      setNotificationCount(0);
    }
  };


  // ==========================================
  // LOAD ONCE
  // ==========================================

  useEffect(() => {

    loadNotificationCount();

  }, []);


  // ==========================================
  // SIDEBAR
  // ==========================================

  const handleCloseSidebar = () => {

    setSidebarOpen(false);

  };


  const handleOpenSidebar = () => {

    setSidebarOpen(true);

  };


  return (

    <div className="min-h-screen bg-slate-50">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        notificationCount={notificationCount}
      />


      {/* ==========================================
          MAIN AREA
      ========================================== */}

      <div className="lg:ml-64 min-h-screen">

        {/* ==========================================
            HEADER
        ========================================== */}

        <Header
          onMenuClick={handleOpenSidebar}
          notificationCount={notificationCount}
        />


        {/* ==========================================
            PAGE CONTENT
        ========================================== */}

        <main className="p-4 sm:p-6 lg:p-8">

          {children}

        </main>

      </div>

    </div>

  );
};

export default DashboardLayout;