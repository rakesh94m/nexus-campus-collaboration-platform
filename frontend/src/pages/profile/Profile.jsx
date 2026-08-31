import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Mail,
  Phone,
  GraduationCap,
  User,
  FileText,
  Briefcase,
  Pencil,
  X,
  Save,
  Link,
  Award,
  Heart,
  Target,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  Clock,
  Circle,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getMyProfile,
  updateProfile,
  updateSocialLinks,
  updateAvailability,
  changePassword,
} from "../../services/studentService";

import { getMySkills } from "../../services/skillService";
import { getMyInterests } from "../../services/interestService";
import { getMyGoals } from "../../services/goalService";
import { getMyAchievements } from "../../services/achievementService";
import { getMyCertifications } from "../../services/certificationService";

// ==========================================
// AVAILABILITY CONFIG (visual only)
// ==========================================

const AVAILABILITY_CONFIG = {
  AVAILABLE: {
    label: "Available",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 border-green-200",
  },
  BUSY: {
    label: "Busy",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  LOOKING_FOR_TEAM: {
    label: "Looking for Team",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  NOT_AVAILABLE: {
    label: "Not Available",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [socialEditOpen, setSocialEditOpen] = useState(false);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [availabilitySaving, setAvailabilitySaving] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    cgpa: "",
    phone: "",
    section: "",
    specialization: "",
  });

  const [socialData, setSocialData] = useState({
    githubUrl: "",
    linkedinUrl: "",
    resumeUrl: "",
  });

  // ==========================================
  // LOAD PROFILE + SKILLS + INTERESTS + ACHIEVEMENTS + CERTIFICATIONS + GOALS
  // ==========================================

  // Wrapped in useCallback to fix ESLint red lines and prevent infinite loops
  const loadProfile = useCallback(async () => {
    try {
      const [
        profileResult,
        skillsResult,
        interestsResult,
        achievementsResult,
        certificationsResult,
        goalsResult,
      ] = await Promise.allSettled([
        getMyProfile(),
        getMySkills(),
        getMyInterests(),
        getMyAchievements(),
        getMyCertifications(),
        getMyGoals(),
      ]);

      // PROFILE
      if (profileResult.status === "fulfilled") {
        const data = profileResult.value;
        setProfile(data);
        setFormData({
          bio: data.bio || "",
          cgpa: data.cgpa ?? "",
          phone: data.phone || "",
          section: data.section || "",
          specialization: data.specialization || "",
        });
        setSocialData({
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          resumeUrl: data.resumeUrl || "",
        });
      } else {
        console.error("Profile error:", profileResult.reason);
        const message =
            profileResult.reason?.response?.data?.message ||
            "Unable to load profile.";
        toast.error(message);
      }

      // SKILLS
      if (skillsResult.status === "fulfilled") {
        setSkills(skillsResult.value || []);
      } else {
        console.error("Skills error:", skillsResult.reason);
        setSkills([]);
      }

      // INTERESTS
      if (interestsResult.status === "fulfilled") {
        setInterests(interestsResult.value || []);
      } else {
        console.error("Interests error:", interestsResult.reason);
        setInterests([]);
      }

      // ACHIEVEMENTS
      if (achievementsResult.status === "fulfilled") {
        setAchievements(achievementsResult.value || []);
      } else {
        console.error(
            "Achievements error:",
            achievementsResult.reason
        );
        setAchievements([]);
      }

      // CERTIFICATIONS
      if (certificationsResult.status === "fulfilled") {
        setCertifications(certificationsResult.value || []);
      } else {
        console.error(
            "Certifications error:",
            certificationsResult.reason
        );
        setCertifications([]);
      }

      // GOALS
      if (goalsResult.status === "fulfilled") {
        setGoals(goalsResult.value || []);
      } else {
        console.error("Goals error:", goalsResult.reason);
        setGoals([]);
      }

    } catch (error) {
      console.error("Profile loading error:", error);
      toast.error(
          error.response?.data?.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Data fetch on mount: this effect is syncing local state with the
  // server (an external system), which is the pattern React's own docs
  // recommend for "fetch on mount". The react-hooks/set-state-in-effect
  // rule flags any setState reachable from an effect body, including
  // this intended case, so it's safe to silence it here.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  // ==========================================
  // PROFILE COMPLETION PERCENTAGE (useMemo)
  // ==========================================

  const profileCompletion = useMemo(() => {
    let completed = 0;
    const total = 12;

    if (profile?.bio) completed++;
    if (profile?.cgpa) completed++;
    if (profile?.phone) completed++;
    if (profile?.section) completed++;
    if (profile?.specialization) completed++;
    if (profile?.githubUrl) completed++;
    if (profile?.linkedinUrl) completed++;
    if (profile?.resumeUrl) completed++;
    if (skills && skills.length > 0) completed++;
    if (goals && goals.length > 0) completed++;
    if (achievements && achievements.length > 0) completed++;
    if (certifications && certifications.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }, [profile, skills, goals, achievements, certifications]); // Only recalculates when these change

  // ==========================================
  // BASIC PROFILE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        bio: formData.bio,
        cgpa: formData.cgpa === "" ? null : Number(formData.cgpa),
        phone: formData.phone,
        section: formData.section,
        specialization: formData.specialization,
      };

      const updatedProfile = await updateProfile(payload);
      setProfile(updatedProfile);

      setFormData({
        bio: updatedProfile.bio || "",
        cgpa: updatedProfile.cgpa ?? "",
        phone: updatedProfile.phone || "",
        section: updatedProfile.section || "",
        specialization: updatedProfile.specialization || "",
      });

      setEditOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);
      const message =
          error.response?.data?.message || "Unable to update profile.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const openEditProfile = () => {
    setFormData({
      bio: profile.bio || "",
      cgpa: profile.cgpa ?? "",
      phone: profile.phone || "",
      section: profile.section || "",
      specialization: profile.specialization || "",
    });
    setEditOpen(true);
  };

  // ==========================================
  // SOCIAL LINKS
  // ==========================================

  const handleSocialChange = (event) => {
    const { name, value } = event.target;
    setSocialData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openSocialEdit = () => {
    setSocialData({
      githubUrl: profile.githubUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      resumeUrl: profile.resumeUrl || "",
    });
    setSocialEditOpen(true);
  };

  const handleSaveSocialLinks = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const updatedProfile = await updateSocialLinks(socialData);
      setProfile(updatedProfile);

      setSocialData({
        githubUrl: updatedProfile.githubUrl || "",
        linkedinUrl: updatedProfile.linkedinUrl || "",
        resumeUrl: updatedProfile.resumeUrl || "",
      });

      setSocialEditOpen(false);
      toast.success("Career links updated successfully!");
    } catch (error) {
      console.error("Social links error:", error);
      const message =
          error.response?.data?.message || "Unable to update career links.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openPasswordModal = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordOpen(true);
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);

    try {
      const message = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      toast.success(message);
      setPasswordOpen(false);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
          error.response?.data?.message || "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // AVAILABILITY
  // ==========================================

  const handleAvailabilityChange = async (event) => {
    const newStatus = event.target.value;
    setAvailabilitySaving(true);

    try {
      const updatedProfile = await updateAvailability({
        availabilityStatus: newStatus,
      });
      setProfile(updatedProfile);
      toast.success("Availability updated successfully!");
    } catch (error) {
      console.error("Availability error:", error);
      const message =
          error.response?.data?.message || "Unable to update availability.";
      toast.error(message);
    } finally {
      setAvailabilitySaving(false);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const formatGoalStatus = (status) => {
    if (!status) return "Not specified";
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getGoalStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "NOT_STARTED":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const getGoalStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 size={13} />;
      case "IN_PROGRESS":
        return <Clock size={13} />;
      default:
        return <Circle size={13} />;
    }
  };

  // ==========================================
  // SHARED UI CLASSES
  // ==========================================

  const inputCls =
      "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  const sectionCardCls =
      "bg-white rounded-2xl border border-slate-200 p-6 mb-5";

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">
              Loading your profile...
            </p>
          </div>
        </div>
    );
  }

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!profile) {
    return (
        <DashboardLayout>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600">
              Profile information could not be loaded.
            </p>
          </div>
        </DashboardLayout>
    );
  }

  // Availability badge config for the current status
  const availConfig =
      AVAILABILITY_CONFIG[profile.availabilityStatus] ?? null;

  // ==========================================
  // RENDER
  // ==========================================

  return (
      <DashboardLayout>

        {/* ==========================================
            PROFILE HEADER CARD
        ========================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <div className="flex flex-col sm:flex-row items-start gap-5">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-3xl sm:text-4xl font-bold select-none shadow-sm ring-4 ring-blue-100">
                {profile.firstName?.charAt(0)?.toUpperCase()}
              </div>
              {/* Availability dot */}
              {availConfig && (
                  <span
                      className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white ${availConfig.dot}`}
                      title={availConfig.label}
                  />
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight truncate">
                {profile.firstName} {profile.lastName}
              </h1>

              <p className="text-sm text-slate-500 mt-0.5 truncate">{profile.email}</p>

              {/* Department + Year */}
              {(profile.department || profile.year) && (
                  <p className="text-sm text-slate-600 mt-1 font-medium">
                    {[profile.department, profile.year ? `Year ${profile.year}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    {profile.specialization ? ` · ${profile.specialization}` : ""}
                  </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  {profile.role}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                  {profile.accountStatus}
                </span>
                {availConfig && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${availConfig.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${availConfig.dot}`} />
                      {availConfig.label}
                  </span>
                )}
              </div>

              {/* Profile Completion bar */}
              <div className="mt-4 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Profile Completion
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {profileCompletion}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button
                onClick={openEditProfile}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shrink-0"
            >
              <Pencil size={15} />
              Edit Profile
            </button>

          </div>
        </section>

        {/* ==========================================
            PERSONAL INFORMATION
        ========================================== */}

        <section className={sectionCardCls}>
          <SectionHeader
              icon={<User size={19} className="text-blue-600" />}
              iconBg="bg-blue-50"
              title="Personal Information"
              subtitle="Your basic student information."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <InfoItem label="First Name" value={profile.firstName} />
            <InfoItem label="Last Name" value={profile.lastName} />
            <InfoItem label="Email" value={profile.email} icon={<Mail size={14} />} />
            <InfoItem label="Phone" value={profile.phone} icon={<Phone size={14} />} />
            <InfoItem label="Roll Number" value={profile.rollNumber} />
            <InfoItem label="Department" value={profile.department} icon={<GraduationCap size={14} />} />
            <InfoItem label="Year" value={profile.year ? `Year ${profile.year}` : null} />
            <InfoItem label="Section" value={profile.section} />
            <InfoItem label="Specialization" value={profile.specialization} />
            <InfoItem label="CGPA" value={profile.cgpa} />
          </div>
        </section>

        {/* ==========================================
            ABOUT / BIO
        ========================================== */}

        <section className={sectionCardCls}>
          <SectionHeader
              icon={<FileText size={19} className="text-purple-600" />}
              iconBg="bg-purple-50"
              title="About"
              subtitle="Your professional introduction."
          />

          {profile.bio ? (
              <p className="text-slate-600 leading-relaxed text-sm">
                {profile.bio}
              </p>
          ) : (
              <div className="rounded-xl bg-slate-50 px-5 py-6 flex items-center gap-4">
                <FileText size={22} className="text-slate-300 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">No bio added yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add a short introduction to help others learn about you.
                  </p>
                </div>
              </div>
          )}
        </section>

        {/* ==========================================
            SKILLS
        ========================================== */}

        <section className={sectionCardCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <SectionHeader
                icon={<Award size={19} className="text-blue-600" />}
                iconBg="bg-blue-50"
                title="Skills"
                subtitle="Your technical and professional skills."
                noMargin
            />
            <a
                href="/skills"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shrink-0"
            >
              Manage Skills
              <ArrowRight size={15} />
            </a>
          </div>

          {skills.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Award size={28} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">No skills added yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add skills to improve your project matching and recommendations.
                </p>
              </div>
          ) : (
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {skill.skillName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-none">
                          {skill.skillName}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                          {formatGoalStatus(skill.proficiency)}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </section>

        {/* ==========================================
            INTERESTS
        ========================================== */}

        <section className={sectionCardCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <SectionHeader
                icon={<Heart size={19} className="text-pink-600" />}
                iconBg="bg-pink-50"
                title="Interests"
                subtitle="Areas and topics you are interested in."
                noMargin
            />
            <a
                href="/interests"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shrink-0"
            >
              Manage Interests
              <ArrowRight size={15} />
            </a>
          </div>

          {interests.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Heart size={28} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">No interests added yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add your interests to improve recommendations and matching.
                </p>
              </div>
          ) : (
              <div className="flex flex-wrap gap-2.5">
                {interests.map((interest) => (
                    <div
                        key={interest.id}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-pink-100 bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors"
                    >
                      <Heart size={13} className="shrink-0" />
                      <span className="text-sm font-semibold">{interest.interestName}</span>
                    </div>
                ))}
              </div>
          )}
        </section>

        {/* ==========================================
            ACHIEVEMENTS
        ========================================== */}

        <section className={sectionCardCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

            <SectionHeader
                icon={<Award size={19} className="text-purple-600" />}
                iconBg="bg-purple-50"
                title="Achievements"
                subtitle="Your certifications, accomplishments, and recognitions."
                noMargin
            />

            <a
                href="/achievements"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shrink-0"
            >
              Manage Achievements
              <ArrowRight size={15} />
            </a>

          </div>

          {achievements.length === 0 ? (

              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Award
                    size={28}
                    className="mx-auto text-slate-300 mb-3"
                />

                <h3 className="text-sm font-semibold text-slate-700">
                  No achievements added yet
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Add your certifications, awards, and accomplishments.
                </p>
              </div>

          ) : (

              <div className="space-y-3">

                {achievements.map((achievement) => (

                    <div
                        key={achievement.id}
                        className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

                        {/* Achievement information */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">

                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Award size={18} />
                          </div>

                          <div className="min-w-0">

                            <h3 className="text-sm font-bold text-slate-900">
                              {achievement.title}
                            </h3>

                            <p className="text-xs font-medium text-slate-500 mt-1">
                              {achievement.issuer}
                            </p>

                            {achievement.description && (
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                  {achievement.description}
                                </p>
                            )}

                          </div>

                        </div>

                        {/* Date + Certificate */}
                        <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">

                          {achievement.achievementDate && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                          {new Date(
                              achievement.achievementDate
                          ).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                          )}

                          {achievement.certificateUrl && (
                              <a
                                  href={achievement.certificateUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                              >
                                View Certificate
                                <ExternalLink size={12} />
                              </a>
                          )}

                        </div>

                      </div>

                    </div>

                ))}

              </div>

          )}

        </section>

        {/* ==========================================
            CERTIFICATIONS
        ========================================== */}

        <section className={sectionCardCls}>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

            <SectionHeader
                icon={<GraduationCap size={19} className="text-green-600" />}
                iconBg="bg-green-50"
                title="Certifications"
                subtitle="Professional certifications and credentials."
                noMargin
            />

            <a
                href="/certifications"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shrink-0"
            >
              Manage Certifications
              <ArrowRight size={15} />
            </a>

          </div>

          {certifications.length === 0 ? (

              <div
                  className="
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-100
                        p-5
                        text-center
                    "
              >

                <GraduationCap
                    size={24}
                    className="
                            mx-auto
                            text-slate-400
                            mb-3
                        "
                />

                <p
                    className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                >
                  No certifications added yet
                </p>

                <p
                    className="
                            text-xs
                            text-slate-500
                            mt-1
                        "
                >
                  Add certifications to strengthen your profile.
                </p>

              </div>

          ) : (

              <div
                  className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-4
                    "
              >

                {certifications.map((certification) => (

                    <div
                        key={certification.id}
                        className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                            "
                    >

                      <div
                          className="
                                    flex
                                    items-start
                                    gap-3
                                "
                      >

                        <div
                            className="
                                        w-10
                                        h-10
                                        rounded-lg
                                        bg-green-50
                                        text-green-600
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                        >
                          <GraduationCap size={18} />
                        </div>


                        <div className="min-w-0">

                          <h3
                              className="
                                            text-sm
                                            font-bold
                                            text-slate-900
                                        "
                          >
                            {certification.certificateName}
                          </h3>


                          <p
                              className="
                                            text-xs
                                            text-slate-500
                                            mt-1
                                        "
                          >
                            {certification.issuingOrganization}
                          </p>


                          {certification.issueDate && (

                              <p
                                  className="
                                                text-xs
                                                text-slate-400
                                                mt-2
                                            "
                              >
                                Issued: {certification.issueDate}
                              </p>

                          )}

                        </div>

                      </div>

                    </div>

                ))}

              </div>

          )}

        </section>

        {/* ==========================================
            GOALS
        ========================================== */}

        <section className={sectionCardCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <SectionHeader
                icon={<Target size={19} className="text-amber-600" />}
                iconBg="bg-amber-50"
                title="Goals"
                subtitle="Your current academic and career goals."
                noMargin
            />
            <a
                href="/goals"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shrink-0"
            >
              Manage Goals
              <ArrowRight size={15} />
            </a>
          </div>

          {goals.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Target size={28} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">No goals added yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add goals to track your progress and make your profile more complete.
                </p>
              </div>
          ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-900">{goal.title}</h3>
                          {goal.description && (
                              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                {goal.description}
                              </p>
                          )}
                        </div>
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${getGoalStatusStyle(goal.status)}`}
                        >
                          {getGoalStatusIcon(goal.status)}
                          {formatGoalStatus(goal.status)}
                        </span>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </section>

        {/* ==========================================
            AVAILABILITY
        ========================================== */}

        <section className={sectionCardCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <SectionHeader
                icon={<Sparkles size={19} className="text-indigo-600" />}
                iconBg="bg-indigo-50"
                title="Availability"
                subtitle="Let other students know when you are available for collaboration."
                noMargin
            />
            <div className="flex items-center gap-3 shrink-0">
              {availabilitySaving && (
                  <span className="text-xs text-slate-400 font-medium">Saving...</span>
              )}
              <select
                  value={profile.availabilityStatus || ""}
                  onChange={handleAvailabilityChange}
                  disabled={availabilitySaving}
                  className="w-full sm:w-52 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition"
              >
                <option value="">Select availability</option>
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy</option>
                <option value="LOOKING_FOR_TEAM">Looking for Team</option>
                <option value="NOT_AVAILABLE">Not Available</option>
              </select>
            </div>
          </div>
        </section>

        {/* ==========================================
            CAREER LINKS
        ========================================== */}

        <section className={sectionCardCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <SectionHeader
                icon={<Briefcase size={19} className="text-slate-700" />}
                iconBg="bg-slate-100"
                title="Career Links"
                subtitle="Your professional and career resources."
                noMargin
            />
            <button
                onClick={openSocialEdit}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shrink-0"
            >
              <Pencil size={14} />
              Edit Links
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LinkCard label="GitHub" value={profile.githubUrl} icon={<Link size={17} />} accentCls="text-slate-900" />
            <LinkCard label="LinkedIn" value={profile.linkedinUrl} icon={<Link size={17} />} accentCls="text-blue-700" />
            <LinkCard label="Resume" value={profile.resumeUrl} icon={<FileText size={17} />} accentCls="text-slate-700" />
          </div>

          {/* Security — Change Password */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Account Security</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your account password to keep your account secure.
                </p>
              </div>
              <button
                  onClick={openPasswordModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition shrink-0"
              >
                <Lock size={15} />
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================
            EDIT PROFILE MODAL
        ========================================== */}

        {editOpen && (
            <div
                className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setEditOpen(false);
                  }
                }}
            >
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Update your profile information.</p>
                  </div>
                  <button
                      onClick={() => setEditOpen(false)}
                      disabled={saving}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition"
                      aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="p-6 space-y-5">

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className={labelCls}>
                      Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell others a little about yourself"
                        className={`${inputCls} resize-none`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="cgpa" className={labelCls}>CGPA</label>
                      <input
                          id="cgpa"
                          name="cgpa"
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={formData.cgpa}
                          onChange={handleChange}
                          placeholder="e.g. 8.91"
                          className={inputCls}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelCls}>Phone</label>
                      <input
                          id="phone"
                          name="phone"
                          type="tel"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10 digit phone number"
                          className={inputCls}
                      />
                      <p className="text-xs text-slate-400 mt-1">Must contain exactly 10 digits.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="section" className={labelCls}>Section</label>
                      <input
                          id="section"
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          placeholder="e.g. A"
                          className={inputCls}
                      />
                    </div>

                    <div>
                      <label htmlFor="specialization" className={labelCls}>Specialization</label>
                      <input
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          placeholder="e.g. Artificial Intelligence"
                          className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => setEditOpen(false)}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
                    >
                      {saving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                      ) : (
                          <>
                            <Save size={15} />
                            Save Changes
                          </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
        )}

        {/* ==========================================
            EDIT SOCIAL LINKS MODAL
        ========================================== */}

        {socialEditOpen && (
            <div
                className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setSocialEditOpen(false);
                  }
                }}
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Edit Career Links</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Add your professional links.</p>
                  </div>
                  <button
                      onClick={() => setSocialEditOpen(false)}
                      disabled={saving}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                      aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveSocialLinks} className="p-6 space-y-5">

                  <div>
                    <label htmlFor="githubUrl" className={labelCls}>GitHub URL</label>
                    <div className="relative">
                      <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                          id="githubUrl"
                          name="githubUrl"
                          type="url"
                          value={socialData.githubUrl}
                          onChange={handleSocialChange}
                          placeholder="https://github.com/username"
                          className={`${inputCls} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="linkedinUrl" className={labelCls}>LinkedIn URL</label>
                    <div className="relative">
                      <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                          id="linkedinUrl"
                          name="linkedinUrl"
                          type="url"
                          value={socialData.linkedinUrl}
                          onChange={handleSocialChange}
                          placeholder="https://linkedin.com/in/username"
                          className={`${inputCls} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="resumeUrl" className={labelCls}>Resume URL</label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                          id="resumeUrl"
                          name="resumeUrl"
                          type="url"
                          value={socialData.resumeUrl}
                          onChange={handleSocialChange}
                          placeholder="https://example.com/resume.pdf"
                          className={`${inputCls} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => setSocialEditOpen(false)}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
                    >
                      {saving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                      ) : (
                          <>
                            <Save size={15} />
                            Save Links
                          </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
        )}

        {/* ==========================================
            CHANGE PASSWORD MODAL
        ========================================== */}

        {passwordOpen && (
            <div
                className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setPasswordOpen(false);
                  }
                }}
            >
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Update your account password.</p>
                  </div>
                  <button
                      onClick={() => setPasswordOpen(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                      aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSavePassword} className="p-6 space-y-4">

                  <div>
                    <label htmlFor="pw-current" className={labelCls}>Current Password</label>
                    <input
                        id="pw-current"
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="pw-new" className={labelCls}>New Password</label>
                    <input
                        id="pw-new"
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="pw-confirm" className={labelCls}>Confirm New Password</label>
                    <input
                        id="pw-confirm"
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className={inputCls}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => setPasswordOpen(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
                    >
                      {saving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                      ) : (
                          "Change Password"
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
        )}

      </DashboardLayout>
  );
};

/* ==========================================
   SECTION HEADER SUB-COMPONENT (file-local)
========================================== */

const SectionHeader = ({ icon, iconBg, title, subtitle, noMargin }) => (
    <div className={`flex items-center gap-3 ${noMargin ? "" : "mb-5"}`}>
      <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>{icon}</div>
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
);

/* ==========================================
   INFO ITEM SUB-COMPONENT
========================================== */

const InfoItem = ({ label, value, icon }) => {
  return (
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span>{label}</span>
        </div>
        <p className="text-sm font-semibold text-slate-900 break-words">
          {value || <span className="text-slate-400 font-normal">Not provided</span>}
        </p>
      </div>
  );
};

/* ==========================================
   LINK CARD SUB-COMPONENT
========================================== */

const LinkCard = ({ label, value, icon, accentCls }) => {
  return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 transition-colors">
        <div className={`flex items-center gap-2 mb-2 ${accentCls || "text-slate-700"}`}>
          {icon}
          <span className="text-sm font-semibold">{label}</span>
        </div>
        {value ? (
            <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
            >
              <span className="truncate max-w-[180px]">{value}</span>
              <ExternalLink size={11} className="shrink-0" />
            </a>
        ) : (
            <p className="text-xs text-slate-400">Not provided</p>
        )}
      </div>
  );
};

export default Profile;