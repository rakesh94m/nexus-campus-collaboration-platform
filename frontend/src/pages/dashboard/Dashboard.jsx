import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Briefcase,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  Heart,
  Sparkles,
  Target,
  Trophy,
  Users,
  Bell,
  Send,
  ArrowUpRight,
  BrainCircuit,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getDashboard } from "../../services/dashboardService";
import { getMyProfile } from "../../services/studentService";
import DashboardLayout from "../../components/layout/DashboardLayout";

// ==========================================
// TIME-BASED GREETING (UI only, no logic)
// ==========================================

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

// ==========================================
// STAT CARD ACCENT CONFIG (visual only)
// Defines per-card colour tokens — no data change
// ==========================================

const STAT_ACCENTS = {
  Projects:       { bg: "bg-blue-50",   icon: "text-blue-600",   val: "text-blue-700"   },
  Skills:         { bg: "bg-purple-50", icon: "text-purple-600", val: "text-purple-700" },
  Interests:      { bg: "bg-pink-50",   icon: "text-pink-600",   val: "text-pink-700"   },
  Achievements:   { bg: "bg-amber-50",  icon: "text-amber-600",  val: "text-amber-700"  },
  Certifications: { bg: "bg-green-50",  icon: "text-green-600",  val: "text-green-700"  },
  Goals:          { bg: "bg-indigo-50", icon: "text-indigo-600", val: "text-indigo-700" },
};

// ==========================================
// DASHBOARD COMPONENT
// ==========================================

const Dashboard = () => {
  const navigate = useNavigate();
  const { student } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!student?.studentId) {
        setLoading(false);
        return;
      }

      try {
        const [dashboardData, profileData] = await Promise.all([
          getDashboard(student.studentId),
          getMyProfile(),
        ]);

        setDashboard(dashboardData);
        setProfile(profileData);
      } catch (error) {
        console.error("Dashboard error:", error);

        const message =
            error.response?.data?.message ||
            "Unable to load dashboard.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [student]);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">
              Loading your dashboard...
            </p>
          </div>
        </div>
    );
  }

  // ==========================================
  // NOT AUTHENTICATED
  // ==========================================

  if (!student) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <button
              onClick={() => navigate("/login")}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
    );
  }

  // ==========================================
  // PROFILE COMPLETION CALCULATION
  // (logic untouched — only display improved)
  // ==========================================

  const profileCompletion = (() => {
    if (!profile) return 0;

    let completed = 0;
    const total = 12;

    if (profile.bio?.trim()) completed++;
    if (profile.cgpa) completed++;
    if (profile.phone?.trim()) completed++;
    if (profile.section?.trim()) completed++;
    if (profile.specialization?.trim()) completed++;
    if (profile.githubUrl?.trim()) completed++;
    if (profile.linkedinUrl?.trim()) completed++;
    if (profile.resumeUrl?.trim()) completed++;

    if ((dashboard?.totalSkills ?? 0) > 0) completed++;
    if ((dashboard?.totalGoals ?? 0) > 0) completed++;
    if ((dashboard?.totalAchievements ?? 0) > 0) completed++;
    if ((dashboard?.totalCertifications ?? 0) > 0) completed++;

    return Math.round((completed / total) * 100);
  })();

  // ==========================================
  // STAT CARDS DATA
  // (values, icons, descriptions untouched)
  // ==========================================

  const stats = [
    {
      title: "Projects",
      value: dashboard?.totalProjects ?? 0,
      icon: Briefcase,
      description: "Projects created",
    },
    {
      title: "Skills",
      value: dashboard?.totalSkills ?? 0,
      icon: Trophy,
      description: "Skills added",
    },
    {
      title: "Interests",
      value: dashboard?.totalInterests ?? 0,
      icon: Heart,
      description: "Areas of interest",
    },
    {
      title: "Achievements",
      value: dashboard?.totalAchievements ?? 0,
      icon: CheckCircle,
      description: "Achievements earned",
    },
    {
      title: "Certifications",
      value: dashboard?.totalCertifications ?? 0,
      icon: GraduationCap,
      description: "Certifications",
    },
    {
      title: "Goals",
      value: dashboard?.totalGoals ?? 0,
      icon: Target,
      description: "Career goals",
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
      <DashboardLayout
          notificationCount={dashboard?.totalNotifications ?? 0}
      >

        {/* ==========================================
            WELCOME SECTION
        ========================================== */}

        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                {getGreeting()} 👋
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {student.fullName}
              </h1>
              <p className="mt-2 text-slate-500 text-sm sm:text-base">
                Here&apos;s an overview of your NEXUS activity and progress.
              </p>
            </div>

            {/* Quick-action CTA */}
            <button
                onClick={() => navigate("/projects")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shrink-0 self-start sm:self-auto"
            >
              <Briefcase size={16} />
              View Projects
            </button>

          </div>
        </section>

        {/* ==========================================
            STAT CARDS
        ========================================== */}

        <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">

          {stats.map((stat) => {
            const Icon   = stat.icon;
            const accent = STAT_ACCENTS[stat.title] ?? STAT_ACCENTS.Projects;

            return (
                <div
                    key={stat.title}
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center mb-3`}>
                    <Icon size={20} className={accent.icon} />
                  </div>

                  {/* Value */}
                  <p className={`text-2xl font-bold ${accent.val}`}>
                    {stat.value}
                  </p>

                  {/* Label */}
                  <p className="text-xs font-medium text-slate-500 mt-1 leading-tight">
                    {stat.title}
                  </p>

                </div>
            );
          })}

        </section>

        {/* ==========================================
            LOWER CARDS ROW
        ========================================== */}

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ==========================================
              PROFILE COMPLETION CARD
          ========================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Profile Completion
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Complete your profile to improve matching.
                </p>
              </div>
              <span className="text-2xl font-bold text-blue-600 shrink-0">
                {profileCompletion}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
              />
            </div>

            {/* Status label */}
            <p className="text-xs text-slate-400 mt-2">
              {profileCompletion < 40
                ? "Just getting started — add more details to improve visibility."
                : profileCompletion < 80
                  ? "Looking good — a few more details will help."
                  : profileCompletion < 100
                    ? "Almost complete — great job!"
                    : "Profile complete!"}
            </p>

            {/* CTA */}
            <button
                onClick={() => navigate("/profile")}
                className="mt-auto pt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              {profileCompletion < 100 ? "Complete profile" : "View profile"}
              <ChevronRight size={16} />
            </button>

          </div>

          {/* ==========================================
              COLLABORATION CARD
          ========================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-purple-50 shrink-0">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Collaboration
                </h3>
                <p className="text-sm text-slate-500">
                  Your collaboration activity
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5">
                  {dashboard?.pendingRequests ?? 0}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  awaiting response
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Accepted
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1.5">
                  {dashboard?.acceptedRequests ?? 0}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  active collaborations
                </p>
              </div>

            </div>

            {/* CTA */}
            <button
                onClick={() => navigate("/collaboration")}
                className="mt-auto pt-5 flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
            >
              View collaboration
              <ChevronRight size={16} />
            </button>

          </div>

          {/* ==========================================
              AI RECOMMENDATIONS CARD
          ========================================== */}

          <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col">

            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center mb-5 shrink-0">
              <Sparkles size={22} className="text-white" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white">
              AI Recommendations
            </h3>

            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Discover projects that match your skills, interests, and career
              goals with AI-powered smart matching.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["Project Matching", "Career Guidance", "Smart Discovery"].map((tag) => (
                <span
                    key={tag}
                    className="px-2.5 py-1 bg-white/10 text-slate-300 text-[10px] font-semibold rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
                onClick={() => navigate("/recommendations")}
                className="mt-auto pt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100 transition self-start"
            >
              Explore Recommendations
              <ArrowUpRight size={15} />
            </button>

          </div>

        </section>

        {/* ==========================================
            ACTIVITY SUMMARY SECTION
        ========================================== */}

        <section className="mt-5 bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Activity Summary
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                A snapshot of your recent NEXUS activity.
              </p>
            </div>
            <button
                onClick={() => navigate("/notifications")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
            >
              <Bell size={13} />
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={14} className="text-slate-400" />
                <p className="text-xs font-medium text-slate-500">Notifications</p>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {dashboard?.totalNotifications ?? 0}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Send size={14} className="text-slate-400" />
                <p className="text-xs font-medium text-slate-500">Requests Sent</p>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {dashboard?.totalRequestsSent ?? 0}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-slate-400" />
                <p className="text-xs font-medium text-slate-500">Collaborations</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                {dashboard?.acceptedRequests ?? 0}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit size={14} className="text-slate-400" />
                <p className="text-xs font-medium text-slate-500">Profile</p>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {profileCompletion}%
              </p>
            </div>

          </div>

        </section>

      </DashboardLayout>
  );
};

export default Dashboard;