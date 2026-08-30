import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { getNotifications } from "../../services/notificationService";

const DashboardLayout = ({ children }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    // ==========================================
    // LOAD ONCE — fetch unread notification count
    // ==========================================

    useEffect(() => {

        const fetchNotifications = async () => {

            try {

                const notifications = await getNotifications();

                const unreadCount = notifications.filter(
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

        fetchNotifications();

    }, []);

    // ==========================================
    // SIDEBAR HANDLERS
    // ==========================================

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const handleOpenSidebar = () => {
        setSidebarOpen(true);
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="min-h-screen bg-slate-50">

            {/* Fixed sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                notificationCount={notificationCount}
            />

            {/* Main content area (offset by sidebar width on lg+) */}
            <div className="lg:ml-64 min-h-screen flex flex-col">

                {/* Sticky header */}
                <Header
                    onMenuClick={handleOpenSidebar}
                    notificationCount={notificationCount}
                />

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

            </div>

        </div>

    );

};

export default DashboardLayout;