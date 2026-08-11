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
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getDashboard } from "../../services/dashboardService";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Dashboard = () => {
  const navigate = useNavigate();
  const { student } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!student?.studentId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getDashboard(student.studentId);

        setDashboard(data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-600
                          border-t-transparent rounded-full
                          animate-spin mx-auto mb-4" />

          <p className="text-slate-600 font-medium">
            Loading your dashboard...
          </p>

        </div>
      </div>
    );
  }

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

  return (
    <DashboardLayout
      notificationCount={dashboard?.totalNotifications ?? 0}
    >

      {/* Welcome */}
      <section className="mb-8">

        <p className="text-sm font-medium text-blue-600 mb-1">
          Welcome back 👋
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          {student.fullName}
        </h1>

        <p className="mt-2 text-slate-500">
          Here's an overview of your NEXUS activity and progress.
        </p>

      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-slate-200
                         p-5 hover:shadow-md transition"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stat.value}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {stat.description}
                  </p>

                </div>

                <div className="p-3 rounded-xl bg-blue-50">
                  <Icon
                    size={22}
                    className="text-blue-600"
                  />
                </div>

              </div>

            </div>
          );
        })}

      </section>

      {/* Lower cards */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <h3 className="font-bold text-slate-900">
            Profile Completion
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Complete your profile to improve matching.
          </p>

          <div className="flex items-center gap-4 mt-6">

            <div className="text-3xl font-bold text-blue-600">
              {dashboard?.profileCompletion ?? 0}%
            </div>

            <div className="flex-1">

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${dashboard?.profileCompletion ?? 0}%`,
                  }}
                />

              </div>

            </div>

          </div>

          <button
            onClick={() => navigate("/profile")}
            className="mt-5 flex items-center gap-2 text-sm
                       font-semibold text-blue-600"
          >
            Complete profile
            <ChevronRight size={16} />
          </button>

        </div>

        {/* Collaboration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-3 rounded-xl bg-purple-50">
              <Users
                size={22}
                className="text-purple-600"
              />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Collaboration
              </h3>

              <p className="text-sm text-slate-500">
                Your collaboration activity
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-slate-50 rounded-xl p-4">

              <p className="text-xs text-slate-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {dashboard?.pendingRequests ?? 0}
              </p>

            </div>

            <div className="bg-slate-50 rounded-xl p-4">

              <p className="text-xs text-slate-500">
                Accepted
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {dashboard?.acceptedRequests ?? 0}
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/collaboration")}
            className="mt-5 flex items-center gap-2 text-sm
                       font-semibold text-purple-600"
          >
            View collaboration
            <ChevronRight size={16} />
          </button>

        </div>

        {/* AI */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white">

          <div className="w-11 h-11 rounded-xl bg-white/10
                          flex items-center justify-center mb-5">

            <Sparkles size={23} />

          </div>

          <h3 className="text-xl font-bold">
            AI Recommendations
          </h3>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Discover projects that match your skills,
            interests, and career goals with AI-powered
            recommendations.
          </p>

          <button
            onClick={() => navigate("/recommendations")}
            className="mt-6 inline-flex items-center gap-2
                       px-4 py-2.5 bg-white text-slate-900
                       rounded-lg text-sm font-semibold"
          >
            Explore Recommendations
            <ChevronRight size={16} />
          </button>

        </div>

      </section>

      {/* Activity */}
      <section className="mt-6 bg-white rounded-2xl
                          border border-slate-200 p-6">

        <h3 className="font-bold text-slate-900">
          Your Activity
        </h3>

        <p className="text-sm text-slate-500 mt-1 mb-5">
          A quick summary of your NEXUS activity.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">
              Notifications
            </p>

            <p className="text-xl font-bold mt-1">
              {dashboard?.totalNotifications ?? 0}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">
              Requests Sent
            </p>

            <p className="text-xl font-bold mt-1">
              {dashboard?.totalRequestsSent ?? 0}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">
              Accepted
            </p>

            <p className="text-xl font-bold mt-1">
              {dashboard?.acceptedRequests ?? 0}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">
              Profile
            </p>

            <p className="text-xl font-bold mt-1">
              {dashboard?.profileCompletion ?? 0}%
            </p>
          </div>

        </div>

      </section>

    </DashboardLayout>
  );
};

export default Dashboard;