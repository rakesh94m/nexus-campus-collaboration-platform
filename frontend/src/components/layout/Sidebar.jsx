import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    FolderKanban,
    UserSearch,
    BrainCircuit,
    CircleHelp,
    Bell,
    Sparkles,
    User,
    Award,
    Heart,
    Target,
    Trophy,
    GraduationCap,
    X,
    LogOut,
    Layers,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// ==========================================
// NAVIGATION GROUPS
// ==========================================

const NAV_GROUPS = [
    {
        label: null,
        items: [
            {
                to: "/dashboard",
                label: "Dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Profile",
        items: [
            {
                to: "/profile",
                label: "My Profile",
                icon: User,
            },
            {
                to: "/skills",
                label: "Skills",
                icon: Award,
            },
            {
                to: "/interests",
                label: "Interests",
                icon: Heart,
            },
            {
                to: "/achievements",
                label: "Achievements",
                icon: Trophy,
            },
            {
                to: "/certifications",
                label: "Certifications",
                icon: GraduationCap,
            },
            {
                to: "/goals",
                label: "Goals",
                icon: Target,
            },
        ],
    },
    {
        label: "Collaborate",
        items: [
            {
                to: "/projects",
                label: "Projects",
                icon: FolderKanban,
            },
            {
                to: "/collaboration",
                label: "Collaboration",
                icon: Users,
            },
            {
                to: "/students",
                label: "Find Students",
                icon: UserSearch,
            },
        ],
    },
    {
        label: "Intelligence",
        items: [
            {
                to: "/recommendations",
                label: "AI Recommendations",
                icon: Sparkles,
            },
            {
                to: "/career-roadmap",
                label: "Career Roadmap",
                icon: BrainCircuit,
            },
        ],
    },
];

// ==========================================
// NAV LINK CLASS HELPER
// ==========================================

const navLinkClass = ({ isActive }) =>
    [
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group",
        isActive
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium",
    ].join(" ");

// ==========================================
// SIDEBAR COMPONENT
// ==========================================

const Sidebar = ({
                     isOpen,
                     onClose,
                     notificationCount = 0,
                 }) => {
    const { student, logout } = useAuth();
    const navigate = useNavigate();

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        onClose();
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <>
            {/* ==========================================
                MOBILE OVERLAY
            ========================================== */}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* ==========================================
                SIDEBAR PANEL
            ========================================== */}

            <aside
                className={[
                    "fixed top-0 left-0 z-50 h-full w-64",
                    "bg-white border-r border-slate-200",
                    "flex flex-col",
                    "transform transition-transform duration-300 ease-in-out",
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                {/* ==========================================
                    BRAND HEADER
                ========================================== */}

                <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 shrink-0">

                    <div className="flex items-center gap-2.5">

                        {/* Brand Icon */}
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                            <Layers
                                size={16}
                                className="text-white"
                                strokeWidth={2.5}
                            />
                        </div>

                        {/* Brand Text */}
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-none tracking-tight">
                                NEXUS
                            </p>

                            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                                Campus Intelligence
                            </p>
                        </div>

                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* ==========================================
                    NAVIGATION
                ========================================== */}

                <nav className="flex-1 overflow-y-auto px-3 py-4">

                    <div className="space-y-5">

                        {/* ==========================================
                            NAVIGATION GROUPS
                        ========================================== */}

                        {NAV_GROUPS.map((group, groupIndex) => (
                            <div key={groupIndex}>

                                {/* Group Label */}
                                {group.label && (
                                    <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                        {group.label}
                                    </p>
                                )}

                                {/* Navigation Items */}
                                <div className="space-y-0.5">

                                    {group.items.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                onClick={onClose}
                                                className={navLinkClass}
                                            >
                                                <Icon
                                                    size={17}
                                                    className="shrink-0"
                                                />

                                                <span>
                                                    {item.label}
                                                </span>
                                            </NavLink>
                                        );
                                    })}

                                </div>

                            </div>
                        ))}

                        {/* ==========================================
                            NOTIFICATIONS
                        ========================================== */}

                        <div>

                            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                Updates
                            </p>

                            <div className="space-y-0.5">

                                <NavLink
                                    to="/notifications"
                                    onClick={onClose}
                                    className={navLinkClass}
                                >
                                    <Bell
                                        size={17}
                                        className="shrink-0"
                                    />

                                    <span className="flex-1">
                                        Notifications
                                    </span>

                                    {notificationCount > 0 && (
                                        <span className="ml-auto min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                                            {notificationCount > 99
                                                ? "99+"
                                                : notificationCount}
                                        </span>
                                    )}

                                </NavLink>

                            </div>

                        </div>

                    </div>

                </nav>

                {/* ==========================================
                    BOTTOM SECTION
                ========================================== */}

                <div className="shrink-0 border-t border-slate-100 p-3 space-y-1">

                    {/* Help & Support */}
                    <NavLink
                        to="/support"
                        onClick={onClose}
                        className={navLinkClass}
                    >
                        <CircleHelp
                            size={17}
                            className="shrink-0"
                        />

                        <span>
                            Help &amp; Support
                        </span>
                    </NavLink>


                    {/* ==========================================
                        USER CARD
                    ========================================== */}

                    {student && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100">

                            <div className="flex items-center gap-2.5">

                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 select-none">
                                    {student.fullName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "S"}
                                </div>


                                {/* User Information */}
                                <div className="flex-1 min-w-0">

                                    <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                                        {student.fullName || "Student"}
                                    </p>

                                    <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                                        {student.email || ""}
                                    </p>

                                </div>


                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition shrink-0"
                                    aria-label="Sign out"
                                    title="Sign out"
                                >
                                    <LogOut size={15} />
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </aside>
        </>
    );
};

export default Sidebar;