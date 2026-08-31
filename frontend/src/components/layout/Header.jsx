import { useState } from "react";

import {
    Bell,
    Menu,
    ChevronDown,
    LogOut,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

// ==========================================
// PAGE META MAP
// Maps route paths to page titles & subtitles
// ==========================================

const PAGE_META = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Overview of your NEXUS activity",
    },

    "/profile": {
        title: "My Profile",
        subtitle: "Account & profile settings",
    },

    "/skills": {
        title: "Skills",
        subtitle: "Manage your technical skills",
    },

    "/interests": {
        title: "Interests",
        subtitle: "Manage your areas of interest",
    },

    "/achievements": {
        title: "Achievements",
        subtitle: "Track your accomplishments",
    },

    "/certifications": {
        title: "Certifications",
        subtitle: "Manage your professional certifications",
    },

    "/goals": {
        title: "Goals",
        subtitle: "Track your academic & career goals",
    },

    "/projects": {
        title: "Projects",
        subtitle: "Manage and discover projects",
    },

    "/collaboration": {
        title: "Collaboration",
        subtitle: "Manage collaboration requests",
    },

    "/students": {
        title: "Find Students",
        subtitle: "Discover and connect with students",
    },

    "/notifications": {
        title: "Notifications",
        subtitle: "Your recent activity & updates",
    },

    "/recommendations": {
        title: "AI Recommendations",
        subtitle: "Smart project matching",
    },

    "/career-roadmap": {
        title: "Career Roadmap",
        subtitle: "AI-powered career development path",
    },

    "/support": {
        title: "Help & Support",
        subtitle: "Get help and submit support tickets",
    },
};

// ==========================================
// HEADER COMPONENT
// ==========================================

const Header = ({
                    onMenuClick,
                    notificationCount = 0,
                }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const { student, logout } = useAuth();

    const [accountOpen, setAccountOpen] = useState(false);

    // ==========================================
    // CURRENT PAGE META
    // ==========================================

    const pageMeta =
        PAGE_META[location.pathname] ?? {
            title: "NEXUS",
            subtitle: "Campus Collaboration Intelligence Platform",
        };

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleLogout = () => {
        logout();
        setAccountOpen(false);
        navigate("/login", { replace: true });
    };

    const handleNotifications = () => {
        navigate("/notifications");
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (

        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200">

            <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

                {/* ==========================================
                    LEFT — MOBILE MENU + PAGE TITLE
                ========================================== */}

                <div className="flex items-center gap-3 min-w-0">

                    {/* Mobile hamburger */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Dynamic page title */}
                    <div className="min-w-0">

                        <p className="hidden sm:block text-xs font-medium text-slate-400 leading-none truncate">
                            {pageMeta.subtitle}
                        </p>

                        <h2 className="text-base font-bold text-slate-900 leading-tight truncate mt-0.5">
                            {pageMeta.title}
                        </h2>

                    </div>

                </div>


                {/* ==========================================
                    RIGHT — NOTIFICATIONS + ACCOUNT
                ========================================== */}

                <div className="flex items-center gap-1.5 shrink-0">

                    {/* ==========================================
                        NOTIFICATION BUTTON
                    ========================================== */}

                    <button
                        onClick={handleNotifications}
                        className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        aria-label="View notifications"
                    >

                        <Bell size={20} />

                        {notificationCount > 0 && (

                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center leading-none">

                                {notificationCount > 99
                                    ? "99+"
                                    : notificationCount}

                            </span>

                        )}

                    </button>


                    {/* ==========================================
                        ACCOUNT AREA
                    ========================================== */}

                    <div className="relative">

                        {/* Account trigger */}
                        <button
                            onClick={() =>
                                setAccountOpen(
                                    (previous) => !previous
                                )
                            }
                            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50 transition"
                            aria-haspopup="true"
                            aria-expanded={accountOpen}
                        >

                            {/* Student name */}
                            <div className="hidden sm:block text-right">

                                <p className="text-sm font-semibold text-slate-900 leading-tight">
                                    {student?.fullName || "Student"}
                                </p>

                                <p className="text-xs text-slate-400 leading-tight">
                                    Student
                                </p>

                            </div>


                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 select-none">

                                {student?.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase() || "S"}

                            </div>


                            {/* Chevron */}
                            <ChevronDown
                                size={15}
                                className={[
                                    "hidden sm:block text-slate-400 transition-transform duration-200",
                                    accountOpen
                                        ? "rotate-180"
                                        : "",
                                ].join(" ")}
                            />

                        </button>


                        {/* ==========================================
                            ACCOUNT DROPDOWN
                        ========================================== */}

                        {accountOpen && (
                            <>

                                {/* Outside click backdrop */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() =>
                                        setAccountOpen(false)
                                    }
                                />


                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg z-20 overflow-hidden">

                                    {/* ==========================================
                                        USER INFORMATION
                                    ========================================== */}

                                    <div className="px-4 py-3">

                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {student?.fullName || "Student"}
                                        </p>

                                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                                            {student?.email || ""}
                                        </p>

                                    </div>


                                    {/* ==========================================
                                        SIGN OUT
                                    ========================================== */}

                                    <div className="p-1 border-t border-slate-100">

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                                        >

                                            <LogOut size={16} />

                                            Sign Out

                                        </button>

                                    </div>

                                </div>

                            </>
                        )}

                    </div>

                </div>

            </div>

        </header>

    );

};

export default Header;