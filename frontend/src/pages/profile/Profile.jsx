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

import {
  getMySkills,
  searchSkills,
  addSkill,
} from "../../services/skillService";
import { getMyInterests } from "../../services/interestService";
import { getMyGoals } from "../../services/goalService";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
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
  // SKILL SEARCH / ADD (autocomplete)
  // ==========================================

  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState("BEGINNER");
  const [suggestions, setSuggestions] = useState([]);

  // ==========================================
  // LOAD PROFILE + SKILLS + INTERESTS + GOALS
  // ==========================================

  // Wrapped in useCallback to fix ESLint red lines and prevent infinite loops
  const loadProfile = useCallback(async () => {
    try {
      const [
        profileResult,
        skillsResult,
        interestsResult,
        goalsResult,
      ] = await Promise.allSettled([
        getMyProfile(),
        getMySkills(),
        getMyInterests(),
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
    const total = 10;

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

    return Math.round((completed / total) * 100);
  }, [profile, skills, goals]); // Only recalculates when these change

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
  // SKILL AUTOCOMPLETE + ADD SKILL
  // ==========================================

  const handleSkillSearch = async (value) => {
    setSkillName(value);
    if (value.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await searchSkills(value);
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const handleAddSkill = async () => {
    if (!skillName.trim()) {
      toast.error("Enter a skill.");
      return;
    }
    try {
      await addSkill({
        skillName,
        proficiency,
      });
      toast.success("Skill added!");
      setSkillName("");
      setSuggestions([]);
      setProficiency("BEGINNER");
      const updated = await getMySkills();
      setSkills(updated);
    } catch (error) {
      toast.error(
          error.response?.data?.message || "Unable to add skill."
      );
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
        return "bg-green-50 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700";
      case "NOT_STARTED":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

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

  return (
      <DashboardLayout>
        {/* ==========================================
          PAGE HEADER
      ========================================== */}
        <section className="mb-8">
          <p className="text-sm font-medium text-blue-600 mb-1">Account</p>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-2 text-slate-500">
            View and manage your NEXUS student profile.
          </p>
        </section>

        {/* ==========================================
          PROFILE HEADER
      ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shrink-0">
              {profile.firstName?.charAt(0)?.toUpperCase()}
            </div>

            {/* Student Information */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold text-slate-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-slate-500 mt-1">{profile.email}</p>

              <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                {profile.role}
              </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                {profile.availabilityStatus}
              </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {profile.accountStatus}
              </span>
              </div>

              {/* Profile Completion Bar Added Here! */}
              <div className="mt-5 max-w-sm">
                <div className="flex items-center justify-between mb-1.5">
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

            {/* Edit Profile */}
            <button
                onClick={openEditProfile}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          </div>
        </section>

        {/* ==========================================
          PERSONAL INFORMATION
      ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-50">
              <User size={21} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>
              <p className="text-sm text-slate-500">
                Your basic student information.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoItem label="First Name" value={profile.firstName} />
            <InfoItem label="Last Name" value={profile.lastName} />
            <InfoItem label="Email" value={profile.email} icon={<Mail size={16} />} />
            <InfoItem label="Phone" value={profile.phone} icon={<Phone size={16} />} />
            <InfoItem label="Roll Number" value={profile.rollNumber} />
            <InfoItem label="Department" value={profile.department} icon={<GraduationCap size={16} />} />
            <InfoItem label="Year" value={profile.year} />
            <InfoItem label="Section" value={profile.section} />
            <InfoItem label="Specialization" value={profile.specialization} />
            <InfoItem label="CGPA" value={profile.cgpa} />
          </div>
        </section>

        {/* ==========================================
          ABOUT
      ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 rounded-xl bg-purple-50">
              <FileText size={21} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">About</h2>
              <p className="text-sm text-slate-500">
                Your professional introduction.
              </p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {profile.bio || "No bio has been added yet."}
          </p>
        </section>

        {/* ==========================================
          SKILLS
      ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50">
                <Award size={21} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Skills</h2>
                <p className="text-sm text-slate-500">
                  Your technical and professional skills.
                </p>
              </div>
            </div>
            <a
                href="/skills"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
            >
              Manage Skills
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mb-6 space-y-3">
            <div className="relative">
              <input
                  type="text"
                  placeholder="Type a skill (Py → Python)"
                  value={skillName}
                  onChange={(e) => handleSkillSearch(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300"
              />
              {suggestions.length > 0 && skillName && (
                  <div className="absolute z-20 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-44 overflow-y-auto">
                    {suggestions.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setSkillName(item);
                              setSuggestions([]);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-100"
                        >
                          {item}
                        </button>
                    ))}
                  </div>
              )}
            </div>
            <div className="flex gap-3">
              <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-300"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
              <button
                  onClick={handleAddSkill}
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold"
              >
                Add Skill
              </button>
            </div>
            {skillName &&
                suggestions.length === 0 && (
                    <p className="text-xs text-green-600">
                      "{skillName}" doesn't exist. It will be created automatically.
                    </p>
                )}
          </div>

          {skills.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Award size={30} className="mx-auto text-slate-400 mb-3" />
                <h3 className="font-semibold text-slate-800">
                  No skills added yet
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Add skills to improve your project matching and recommendations.
                </p>
              </div>
          ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        {skill.skillName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {skill.skillName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
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
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-50">
                <Heart size={21} className="text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Interests</h2>
                <p className="text-sm text-slate-500">
                  Areas and topics you are interested in.
                </p>
              </div>
            </div>
            <a
                href="/interests"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
            >
              Manage Interests
              <ArrowRight size={16} />
            </a>
          </div>

          {interests.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Heart size={30} className="mx-auto text-slate-400 mb-3" />
                <h3 className="font-semibold text-slate-800">
                  No interests added yet
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Add your interests to improve recommendations and matching.
                </p>
              </div>
          ) : (
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                    <div
                        key={interest.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                        <Heart size={17} />
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {interest.interestName}
                      </p>
                    </div>
                ))}
              </div>
          )}
        </section>

        {/* ==========================================
          GOALS
      ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50">
                <Target size={21} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Goals</h2>
                <p className="text-sm text-slate-500">
                  Your current academic and career goals.
                </p>
              </div>
            </div>
            <a
                href="/goals"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
            >
              Manage Goals
              <ArrowRight size={16} />
            </a>
          </div>

          {goals.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Target size={30} className="mx-auto text-slate-400 mb-3" />
                <h3 className="font-semibold text-slate-800">No goals added yet</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Add goals to make your profile more complete.
                </p>
              </div>
          ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900">{goal.title}</h3>
                          {goal.description && (
                              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                {goal.description}
                              </p>
                          )}
                        </div>
                        <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${getGoalStatusStyle(
                                goal.status
                            )}`}
                        >
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
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Availability</h2>
              <p className="text-sm text-slate-500 mt-1">
                Let other students know when you are available for collaboration.
              </p>
            </div>
            <select
                value={profile.availabilityStatus || ""}
                onChange={handleAvailabilityChange}
                disabled={availabilitySaving}
                className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value="">Select availability</option>
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="LOOKING_FOR_TEAM">Looking for Team</option>
              <option value="NOT_AVAILABLE">Not Available</option>
            </select>
          </div>
        </section>

        {/* ==========================================
          CAREER LINKS
      ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-100">
                <Briefcase size={21} className="text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Career Links
                </h2>
                <p className="text-sm text-slate-500">
                  Your professional and career resources.
                </p>
              </div>
            </div>
            <button
                onClick={openSocialEdit}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
            >
              <Pencil size={16} />
              Edit Links
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LinkCard label="GitHub" value={profile.githubUrl} />
            <LinkCard label="LinkedIn" value={profile.linkedinUrl} />
            <LinkCard label="Resume" value={profile.resumeUrl} />
          </div>

          <div className="mt-5 pt-5 border-t border-slate-200">
            <button
                onClick={openPasswordModal}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              <Sparkles size={18} />
              Change Password
            </button>
          </div>
        </section>

        {/* ==========================================
          EDIT PROFILE MODAL
      ========================================== */}
        {editOpen && (
            <div
                className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setEditOpen(false);
                  }
                }}
            >
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Edit Profile
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Update your profile information.
                    </p>
                  </div>
                  <button
                      onClick={() => setEditOpen(false)}
                      disabled={saving}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                  <div>
                    <label
                        htmlFor="bio"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell others about yourself..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                          htmlFor="cgpa"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        CGPA
                      </label>
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
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Phone
                      </label>
                      <input
                          id="phone"
                          name="phone"
                          type="tel"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10 digit phone number"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Must contain exactly 10 digits.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                          htmlFor="section"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Section
                      </label>
                      <input
                          id="section"
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          placeholder="e.g. A"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                          htmlFor="specialization"
                          className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Specialization
                      </label>
                      <input
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          placeholder="e.g. Artificial Intelligence"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={() => setEditOpen(false)}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                    >
                      {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                      ) : (
                          <>
                            <Save size={17} />
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
                className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setSocialEditOpen(false);
                  }
                }}
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Edit Career Links
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Add your professional links.
                    </p>
                  </div>
                  <button
                      onClick={() => setSocialEditOpen(false)}
                      disabled={saving}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveSocialLinks} className="p-6 space-y-5">
                  <div>
                    <label
                        htmlFor="githubUrl"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      GitHub URL
                    </label>
                    <div className="relative">
                      <Link
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                          id="githubUrl"
                          name="githubUrl"
                          type="url"
                          value={socialData.githubUrl}
                          onChange={handleSocialChange}
                          placeholder="https://github.com/username"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                        htmlFor="linkedinUrl"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      LinkedIn URL
                    </label>
                    <div className="relative">
                      <Link
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                          id="linkedinUrl"
                          name="linkedinUrl"
                          type="url"
                          value={socialData.linkedinUrl}
                          onChange={handleSocialChange}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                        htmlFor="resumeUrl"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Resume URL
                    </label>
                    <div className="relative">
                      <FileText
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                          id="resumeUrl"
                          name="resumeUrl"
                          type="url"
                          value={socialData.resumeUrl}
                          onChange={handleSocialChange}
                          placeholder="https://example.com/resume.pdf"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={() => setSocialEditOpen(false)}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                    >
                      {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                      ) : (
                          <>
                            <Save size={17} />
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
                className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setPasswordOpen(false);
                  }
                }}
            >
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold">Change Password</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Update your account password.
                    </p>
                  </div>
                  <button onClick={() => setPasswordOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSavePassword} className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold">
                      Current Password
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setPasswordOpen(false)}
                        className="px-4 py-2.5 border border-slate-300 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl"
                    >
                      {saving ? "Saving..." : "Change Password"}
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
   INFO ITEM
========================================== */

const InfoItem = ({ label, value, icon }) => {
  return (
      <div className="rounded-xl bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          {icon}
          <span>{label}</span>
        </div>
        <p className="text-sm font-semibold text-slate-900">
          {value || "Not provided"}
        </p>
      </div>
  );
};

/* ==========================================
   LINK CARD
========================================== */

const LinkCard = ({ label, value }) => {
  return (
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-slate-700 mb-2">
          <Link size={19} />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        {value ? (
            <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
            >
              {value}
            </a>
        ) : (
            <p className="text-sm text-slate-400">Not provided</p>
        )}
      </div>
  );
};

export default Profile;
