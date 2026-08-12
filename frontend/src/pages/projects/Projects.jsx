import { useEffect, useState } from "react";

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
  Target,
  Plus,
  CheckCircle2,
  Clock3,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getMyProfile,
  updateProfile,
  updateSocialLinks,
  updateAvailability,
} from "../../services/studentService";

import {
  getMyGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../../services/goalService";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [socialEditOpen, setSocialEditOpen] =
    useState(false);

  const [availabilitySaving, setAvailabilitySaving] =
    useState(false);

  // ==========================================
  // GOALS STATE
  // ==========================================

  const [goals, setGoals] = useState([]);

  const [goalsLoading, setGoalsLoading] =
    useState(true);

  const [goalSaving, setGoalSaving] =
    useState(false);

  const [goalModalOpen, setGoalModalOpen] =
    useState(false);

  const [editingGoal, setEditingGoal] =
    useState(null);

  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    status: "NOT_STARTED",
  });

  // ==========================================
  // PROFILE FORM
  // ==========================================

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
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProfile();
    loadGoals();
  }, []);

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();

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
    } catch (error) {
      console.error("Profile error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to load profile.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD GOALS
  // ==========================================

  const loadGoals = async () => {
    try {
      setGoalsLoading(true);

      const data = await getMyGoals();

      setGoals(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("Goals loading error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load goals."
      );

      setGoals([]);
    } finally {
      setGoalsLoading(false);
    }
  };

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
        cgpa:
          formData.cgpa === ""
            ? null
            : Number(formData.cgpa),
        phone: formData.phone,
        section: formData.section,
        specialization: formData.specialization,
      };

      const updatedProfile =
        await updateProfile(payload);

      setProfile(updatedProfile);

      setFormData({
        bio: updatedProfile.bio || "",
        cgpa: updatedProfile.cgpa ?? "",
        phone: updatedProfile.phone || "",
        section: updatedProfile.section || "",
        specialization:
          updatedProfile.specialization || "",
      });

      setEditOpen(false);

      toast.success(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to update profile.";

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
      specialization:
        profile.specialization || "",
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
      const updatedProfile =
        await updateSocialLinks(socialData);

      setProfile(updatedProfile);

      setSocialData({
        githubUrl:
          updatedProfile.githubUrl || "",
        linkedinUrl:
          updatedProfile.linkedinUrl || "",
        resumeUrl:
          updatedProfile.resumeUrl || "",
      });

      setSocialEditOpen(false);

      toast.success(
        "Career links updated successfully!"
      );
    } catch (error) {
      console.error(
        "Social links error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to update career links.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // AVAILABILITY
  // ==========================================

  const handleAvailabilityChange = async (
    event
  ) => {
    const newStatus = event.target.value;

    setAvailabilitySaving(true);

    try {
      const updatedProfile =
        await updateAvailability({
          availabilityStatus: newStatus,
        });

      setProfile(updatedProfile);

      toast.success(
        "Availability updated successfully!"
      );
    } catch (error) {
      console.error(
        "Availability error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to update availability.";

      toast.error(message);
    } finally {
      setAvailabilitySaving(false);
    }
  };

  // ==========================================
  // GOAL HELPERS
  // ==========================================

  const resetGoalForm = () => {
    setGoalForm({
      title: "",
      description: "",
      status: "NOT_STARTED",
    });

    setEditingGoal(null);
  };

  const openAddGoal = () => {
    resetGoalForm();
    setGoalModalOpen(true);
  };

  const openEditGoal = (goal) => {
    setEditingGoal(goal);

    setGoalForm({
      title: goal.title || "",
      description: goal.description || "",
      status: goal.status || "NOT_STARTED",
    });

    setGoalModalOpen(true);
  };

  const handleGoalChange = (event) => {
    const { name, value } = event.target;

    setGoalForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE GOAL
  // ==========================================

  const handleSaveGoal = async (event) => {
    event.preventDefault();

    if (!goalForm.title.trim()) {
      toast.error("Please enter a goal title.");
      return;
    }

    setGoalSaving(true);

    try {
      const payload = {
        title: goalForm.title.trim(),
        description:
          goalForm.description.trim(),
        status: goalForm.status,
      };

      if (editingGoal) {
        const updatedGoal =
          await updateGoal(
            editingGoal.id,
            payload
          );

        setGoals((previous) =>
          previous.map((goal) =>
            goal.id === updatedGoal.id
              ? updatedGoal
              : goal
          )
        );

        toast.success(
          "Goal updated successfully!"
        );
      } else {
        const createdGoal =
          await addGoal(payload);

        setGoals((previous) => [
          createdGoal,
          ...previous,
        ]);

        toast.success(
          "Goal added successfully!"
        );
      }

      setGoalModalOpen(false);
      resetGoalForm();
    } catch (error) {
      console.error(
        "Goal save error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to save goal."
      );
    } finally {
      setGoalSaving(false);
    }
  };

  // ==========================================
  // DELETE GOAL
  // ==========================================

  const handleDeleteGoal = async (goal) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${goal.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteGoal(goal.id);

      setGoals((previous) =>
        previous.filter(
          (item) => item.id !== goal.id
        )
      );

      toast.success(
        "Goal deleted successfully."
      );
    } catch (error) {
      console.error(
        "Goal delete error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete goal."
      );
    }
  };

  // ==========================================
  // GOAL STATUS DISPLAY
  // ==========================================

  const getGoalStatusLabel = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";

      case "COMPLETED":
        return "Completed";

      case "NOT_STARTED":
      default:
        return "Not Started";
    }
  };

  const getGoalStatusClasses = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          wrapper:
            "bg-green-50 border-green-100",
          icon:
            "bg-green-100 text-green-600",
          badge:
            "bg-green-100 text-green-700",
        };

      case "IN_PROGRESS":
        return {
          wrapper:
            "bg-blue-50 border-blue-100",
          icon:
            "bg-blue-100 text-blue-600",
          badge:
            "bg-blue-100 text-blue-700",
        };

      case "NOT_STARTED":
      default:
        return {
          wrapper:
            "bg-slate-50 border-slate-200",
          icon:
            "bg-slate-100 text-slate-500",
          badge:
            "bg-slate-100 text-slate-600",
        };
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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

          <p className="text-slate-600 font-medium">
            Loading your profile...
          </p>

        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-8
            text-center
          "
        >
          <p className="text-slate-600">
            Profile information could not be
            loaded.
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

        <p className="text-sm font-medium text-blue-600 mb-1">
          Account
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage your NEXUS student profile.
        </p>

      </section>

      {/* ==========================================
          PROFILE HEADER
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
          mb-6
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            gap-5
          "
        >

          {/* Avatar */}

          <div
            className="
              w-24
              h-24
              rounded-2xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              text-4xl
              font-bold
              shrink-0
            "
          >
            {profile.firstName
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          {/* Student Information */}

          <div className="flex-1">

            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              {profile.firstName}{" "}
              {profile.lastName}
            </h2>

            <p className="text-slate-500 mt-1">
              {profile.email}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">

              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-blue-50
                  text-blue-700
                  text-xs
                  font-semibold
                "
              >
                {profile.role}
              </span>

              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-green-50
                  text-green-700
                  text-xs
                  font-semibold
                "
              >
                {profile.availabilityStatus}
              </span>

              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-slate-100
                  text-slate-600
                  text-xs
                  font-semibold
                "
              >
                {profile.accountStatus}
              </span>

            </div>

          </div>

          {/* Edit Profile */}

          <button
            onClick={openEditProfile}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              bg-blue-600
              text-white
              rounded-xl
              text-sm
              font-semibold
              hover:bg-blue-700
              transition
            "
          >
            <Pencil size={17} />
            Edit Profile
          </button>

        </div>

      </section>

      {/* ==========================================
          PERSONAL INFORMATION
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
          mb-6
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 rounded-xl bg-blue-50">

            <User
              size={21}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Personal Information
            </h2>

            <p className="text-sm text-slate-500">
              Your basic student information.
            </p>

          </div>

        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          "
        >

          <InfoItem
            label="First Name"
            value={profile.firstName}
          />

          <InfoItem
            label="Last Name"
            value={profile.lastName}
          />

          <InfoItem
            label="Email"
            value={profile.email}
            icon={<Mail size={16} />}
          />

          <InfoItem
            label="Phone"
            value={profile.phone}
            icon={<Phone size={16} />}
          />

          <InfoItem
            label="Roll Number"
            value={profile.rollNumber}
          />

          <InfoItem
            label="Department"
            value={profile.department}
            icon={
              <GraduationCap size={16} />
            }
          />

          <InfoItem
            label="Year"
            value={profile.year}
          />

          <InfoItem
            label="Section"
            value={profile.section}
          />

          <InfoItem
            label="Specialization"
            value={profile.specialization}
          />

          <InfoItem
            label="CGPA"
            value={profile.cgpa}
          />

        </div>

      </section>

      {/* ==========================================
          ABOUT
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
          mb-6
        "
      >

        <div className="flex items-center gap-3 mb-5">

          <div className="p-3 rounded-xl bg-purple-50">

            <FileText
              size={21}
              className="text-purple-600"
            />

          </div>

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              About
            </h2>

            <p className="text-sm text-slate-500">
              Your professional introduction.
            </p>

          </div>

        </div>

        <p
          className="
            text-slate-600
            leading-relaxed
          "
        >
          {profile.bio ||
            "No bio has been added yet."}
        </p>

      </section>

      {/* ==========================================
          GOALS
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
          mb-6
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-4
            mb-6
          "
        >

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-xl bg-blue-50">

              <Target
                size={21}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                My Goals
              </h2>

              <p className="text-sm text-slate-500">
                Set and track your academic and career goals.
              </p>

            </div>

          </div>

          <button
            onClick={openAddGoal}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              bg-blue-600
              text-white
              rounded-xl
              text-sm
              font-semibold
              hover:bg-blue-700
              transition
            "
          >
            <Plus size={17} />
            Add Goal
          </button>

        </div>

        {goalsLoading ? (

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              py-8
            "
          >

            <div
              className="
                w-5
                h-5
                border-2
                border-blue-600
                border-t-transparent
                rounded-full
                animate-spin
              "
            />

            <p className="text-sm text-slate-500">
              Loading your goals...
            </p>

          </div>

        ) : goals.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-slate-50
              p-8
              text-center
            "
          >

            <div
              className="
                w-12
                h-12
                mx-auto
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <Target size={24} />
            </div>

            <h3
              className="
                mt-4
                font-semibold
                text-slate-900
              "
            >
              No goals yet
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Add your first goal and start tracking your progress.
            </p>

            <button
              onClick={openAddGoal}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-white
                border
                border-slate-200
                text-blue-600
                text-sm
                font-semibold
                hover:bg-blue-50
                transition
              "
            >
              <Plus size={16} />
              Add Your First Goal
            </button>

          </div>

        ) : (

          <div className="space-y-3">

            {goals.map((goal) => {

              const statusClasses =
                getGoalStatusClasses(
                  goal.status
                );

              return (
                <div
                  key={goal.id}
                  className={`
                    rounded-xl
                    border
                    p-4
                    transition
                    ${statusClasses.wrapper}
                  `}
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >

                    <div
                      className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${statusClasses.icon}
                      `}
                    >
                      {goal.status ===
                      "COMPLETED" ? (
                        <CheckCircle2
                          size={20}
                        />
                      ) : goal.status ===
                        "IN_PROGRESS" ? (
                        <Clock3
                          size={20}
                        />
                      ) : (
                        <Target
                          size={20}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          gap-2
                        "
                      >

                        <h3
                          className="
                            text-sm
                            font-bold
                            text-slate-900
                          "
                        >
                          {goal.title}
                        </h3>

                        <span
                          className={`
                            self-start
                            px-2.5
                            py-1
                            rounded-full
                            text-[11px]
                            font-semibold
                            ${statusClasses.badge}
                          `}
                        >
                          {getGoalStatusLabel(
                            goal.status
                          )}
                        </span>

                      </div>

                      {goal.description && (

                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-600
                          "
                        >
                          {goal.description}
                        </p>

                      )}

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        shrink-0
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          openEditGoal(goal)
                        }
                        className="
                          p-2
                          rounded-lg
                          text-slate-500
                          hover:bg-white
                          hover:text-blue-600
                          transition
                        "
                        title="Edit goal"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteGoal(
                            goal
                          )
                        }
                        className="
                          p-2
                          rounded-lg
                          text-slate-500
                          hover:bg-white
                          hover:text-red-600
                          transition
                        "
                        title="Delete goal"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

      {/* ==========================================
          AVAILABILITY
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
          mb-6
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Availability
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Let other students know when you
              are available for collaboration.
            </p>

          </div>

          <select
            value={
              profile.availabilityStatus || ""
            }
            onChange={
              handleAvailabilityChange
            }
            disabled={availabilitySaving}
            className="
              w-full
              sm:w-48
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-300
              bg-white
              text-sm
              font-medium
              text-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              disabled:opacity-60
            "
          >

            <option value="">
              Select availability
            </option>

            <option value="AVAILABLE">
              Available
            </option>

            <option value="BUSY">
              Busy
            </option>

            <option value="LOOKING_FOR_TEAM">
              Looking for Team
            </option>

            <option value="NOT_AVAILABLE">
              Not Available
            </option>

          </select>

        </div>

      </section>

      {/* ==========================================
          CAREER LINKS
      ========================================== */}

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
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-4
            mb-6
          "
        >

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-xl bg-slate-100">

              <Briefcase
                size={21}
                className="text-slate-700"
              />

            </div>

            <div>

              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                Career Links
              </h2>

              <p className="text-sm text-slate-500">
                Your professional and career resources.
              </p>

            </div>

          </div>

          <button
            onClick={openSocialEdit}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              border
              border-slate-300
              text-slate-700
              rounded-xl
              text-sm
              font-semibold
              hover:bg-slate-50
              transition
            "
          >
            <Pencil size={16} />
            Edit Links
          </button>

        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >

          <LinkCard
            label="GitHub"
            value={profile.githubUrl}
          />

          <LinkCard
            label="LinkedIn"
            value={profile.linkedinUrl}
          />

          <LinkCard
            label="Resume"
            value={profile.resumeUrl}
          />

        </div>

      </section>

      {/* ==========================================
          EDIT PROFILE MODAL
      ========================================== */}

      {editOpen && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setEditOpen(false);
            }

          }}
        >

          <div
            className="
              w-full
              max-w-2xl
              bg-white
              rounded-2xl
              shadow-2xl
              max-h-[90vh]
              overflow-y-auto
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-slate-200
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Edit Profile
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  Update your profile information.
                </p>

              </div>

              <button
                onClick={() =>
                  setEditOpen(false)
                }
                disabled={saving}
                className="
                  p-2
                  rounded-lg
                  hover:bg-slate-100
                  text-slate-500
                  disabled:opacity-50
                "
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSaveProfile}
              className="p-6 space-y-5"
            >

              <div>

                <label
                  htmlFor="bio"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
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
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    resize-none
                  "
                />

              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                "
              >

                <div>

                  <label
                    htmlFor="cgpa"
                    className="
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      mb-2
                    "
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
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                <div>

                  <label
                    htmlFor="phone"
                    className="
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      mb-2
                    "
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
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <p
                    className="
                      text-xs
                      text-slate-400
                      mt-1
                    "
                  >
                    Must contain exactly 10 digits.
                  </p>

                </div>

              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                "
              >

                <div>

                  <label
                    htmlFor="section"
                    className="
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      mb-2
                    "
                  >
                    Section
                  </label>

                  <input
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. A"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                <div>

                  <label
                    htmlFor="specialization"
                    className="
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      mb-2
                    "
                  >
                    Specialization
                  </label>

                  <input
                    id="specialization"
                    name="specialization"
                    value={
                      formData.specialization
                    }
                    onChange={handleChange}
                    placeholder="e.g. Artificial Intelligence"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

              </div>

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  pt-4
                  border-t
                  border-slate-200
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setEditOpen(false)
                  }
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-300
                    text-slate-700
                    font-semibold
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-xl
                    bg-blue-600
                    text-white
                    font-semibold
                    hover:bg-blue-700
                    disabled:opacity-60
                  "
                >

                  {saving ? (
                    <>
                      <div
                        className="
                          w-4
                          h-4
                          border-2
                          border-white
                          border-t-transparent
                          rounded-full
                          animate-spin
                        "
                      />

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
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setSocialEditOpen(false);
            }

          }}
        >

          <div
            className="
              w-full
              max-w-lg
              bg-white
              rounded-2xl
              shadow-2xl
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-slate-200
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Edit Career Links
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  Add your professional links.
                </p>

              </div>

              <button
                onClick={() =>
                  setSocialEditOpen(false)
                }
                disabled={saving}
                className="
                  p-2
                  rounded-lg
                  hover:bg-slate-100
                  text-slate-500
                "
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSaveSocialLinks}
              className="p-6 space-y-5"
            >

              <div>

                <label
                  htmlFor="githubUrl"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  GitHub URL
                </label>

                <div className="relative">

                  <Link
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    value={
                      socialData.githubUrl
                    }
                    onChange={
                      handleSocialChange
                    }
                    placeholder="https://github.com/username"
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

              </div>

              <div>

                <label
                  htmlFor="linkedinUrl"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  LinkedIn URL
                </label>

                <div className="relative">

                  <Link
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    value={
                      socialData.linkedinUrl
                    }
                    onChange={
                      handleSocialChange
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

              </div>

              <div>

                <label
                  htmlFor="resumeUrl"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Resume URL
                </label>

                <div className="relative">

                  <FileText
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="resumeUrl"
                    name="resumeUrl"
                    type="url"
                    value={
                      socialData.resumeUrl
                    }
                    onChange={
                      handleSocialChange
                    }
                    placeholder="https://example.com/resume.pdf"
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

              </div>

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  pt-4
                  border-t
                  border-slate-200
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setSocialEditOpen(
                      false
                    )
                  }
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-300
                    text-slate-700
                    font-semibold
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-xl
                    bg-blue-600
                    text-white
                    font-semibold
                    hover:bg-blue-700
                    disabled:opacity-60
                  "
                >

                  {saving ? (
                    <>
                      <div
                        className="
                          w-4
                          h-4
                          border-2
                          border-white
                          border-t-transparent
                          rounded-full
                          animate-spin
                        "
                      />

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
          ADD / EDIT GOAL MODAL
      ========================================== */}

      {goalModalOpen && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              if (!goalSaving) {
                setGoalModalOpen(false);
                resetGoalForm();
              }
            }

          }}
        >

          <div
            className="
              w-full
              max-w-lg
              bg-white
              rounded-2xl
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-slate-200
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  {editingGoal
                    ? "Edit Goal"
                    : "Add Goal"}
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  {editingGoal
                    ? "Update your goal and track its progress."
                    : "Add a new academic or career goal."}
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  if (!goalSaving) {
                    setGoalModalOpen(false);
                    resetGoalForm();
                  }
                }}
                disabled={goalSaving}
                className="
                  p-2
                  rounded-lg
                  hover:bg-slate-100
                  text-slate-500
                  disabled:opacity-50
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleSaveGoal}
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label
                  htmlFor="goalTitle"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Goal Title
                </label>

                <input
                  id="goalTitle"
                  name="title"
                  value={goalForm.title}
                  onChange={handleGoalChange}
                  placeholder="e.g. Complete AWS Certification"
                  maxLength={200}
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label
                  htmlFor="goalDescription"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Description
                </label>

                <textarea
                  id="goalDescription"
                  name="description"
                  value={
                    goalForm.description
                  }
                  onChange={handleGoalChange}
                  rows={4}
                  placeholder="Describe what you want to achieve..."
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    resize-none
                  "
                />

              </div>

              {/* STATUS */}

              <div>

                <label
                  htmlFor="goalStatus"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Status
                </label>

                <select
                  id="goalStatus"
                  name="status"
                  value={goalForm.status}
                  onChange={handleGoalChange}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    text-slate-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                >

                  <option value="NOT_STARTED">
                    Not Started
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>

              </div>

              {/* ACTIONS */}

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  pt-4
                  border-t
                  border-slate-200
                "
              >

                <button
                  type="button"
                  onClick={() => {
                    setGoalModalOpen(false);
                    resetGoalForm();
                  }}
                  disabled={goalSaving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-300
                    text-slate-700
                    font-semibold
                    hover:bg-slate-50
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={goalSaving}
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-xl
                    bg-blue-600
                    text-white
                    font-semibold
                    hover:bg-blue-700
                    disabled:opacity-60
                  "
                >

                  {goalSaving ? (
                    <>
                      <div
                        className="
                          w-4
                          h-4
                          border-2
                          border-white
                          border-t-transparent
                          rounded-full
                          animate-spin
                        "
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />

                      {editingGoal
                        ? "Update Goal"
                        : "Add Goal"}
                    </>
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
   INFO ITEM
========================================== */

const InfoItem = ({
  label,
  value,
  icon,
}) => {
  return (
    <div
      className="
        rounded-xl
        bg-slate-50
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          font-medium
          text-slate-500
          mb-2
        "
      >
        {icon}

        <span>
          {label}
        </span>

      </div>

      <p
        className="
          text-sm
          font-semibold
          text-slate-900
        "
      >
        {value || "Not provided"}
      </p>

    </div>
  );
};

/* ==========================================
   LINK CARD
========================================== */

const LinkCard = ({
  label,
  value,
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-slate-700
          mb-2
        "
      >

        <Link size={19} />

        <span
          className="
            text-sm
            font-semibold
          "
        >
          {label}
        </span>

      </div>

      {value ? (

        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="
            text-sm
            text-blue-600
            hover:underline
            break-all
          "
        >
          {value}
        </a>

      ) : (

        <p className="text-sm text-slate-400">
          Not provided
        </p>

      )}

    </div>
  );
};

export default Profile;