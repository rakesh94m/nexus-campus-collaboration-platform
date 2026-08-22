import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  X,
  Save,
  FolderKanban,
  ExternalLink,
  CalendarDays,
  Sparkles,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  LogOut,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getMyProjects,
  getAvailableProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

import {
  getMyProjectMembers,
  getProjectMembers,
  joinProject,
  updateProjectMember,
  leaveProject,
  removeProjectMember,
} from "../../services/projectMemberService";

import { getMySkills } from "../../services/skillService";
import { getProjectMatches } from "../../services/matchingService";

// ==========================================
// MEMBER ROLES
// ==========================================

const MEMBER_ROLES = [
  {
    value: "LEADER",
    label: "Leader",
  },
  {
    value: "BACKEND_DEVELOPER",
    label: "Backend Developer",
  },
  {
    value: "FRONTEND_DEVELOPER",
    label: "Frontend Developer",
  },
  {
    value: "AI_ENGINEER",
    label: "AI Engineer",
  },
  {
    value: "DATABASE_ENGINEER",
    label: "Database Engineer",
  },
  {
    value: "TESTER",
    label: "Tester",
  },
  {
    value: "MEMBER",
    label: "Member",
  },
];

const SKILL_IMPORTANCE = [
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "LOW",
    label: "Low",
  },
];

// ==========================================
// PROJECTS COMPONENT
// ==========================================

const Projects = () => {
  const navigate = useNavigate();

  // ==========================================
  // PROJECT STATE
  // ==========================================

  const [projects, setProjects] = useState([]);
  const [availableProjects, setAvailableProjects] =
      useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedProject, setSelectedProject] =
      useState(null);

  // ==========================================
  // PROJECT SKILLS
  // ==========================================

  const [mySkills, setMySkills] = useState([]);

  const [requiredSkills, setRequiredSkills] =
      useState([]);

  const [selectedSkillId, setSelectedSkillId] =
      useState("");

  const [selectedSkillImportance, setSelectedSkillImportance] =
      useState("HIGH");

  const [skillsLoading, setSkillsLoading] =
      useState(false);

  // ==========================================
  // SMART MATCHING
  // ==========================================
  const [projectMatches, setProjectMatches] =
      useState([]);
  const [matchesLoading, setMatchesLoading] =
      useState(true);
  const [matchesError, setMatchesError] =
      useState("");

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    technologiesUsed: "",
    githubUrl: "",
    liveDemoUrl: "",
    startDate: "",
    endDate: "",
  });

  // ==========================================
  // MY MEMBERSHIPS
  // ==========================================

  const [memberships, setMemberships] = useState([]);

  const [membersLoading, setMembersLoading] =
      useState(true);

  const [joinProjectId, setJoinProjectId] =
      useState(null);

  const [joinRole, setJoinRole] =
      useState("MEMBER");

  const [joining, setJoining] =
      useState(false);

  const [editingMemberId, setEditingMemberId] =
      useState(null);

  const [editingRole, setEditingRole] =
      useState("MEMBER");

  const [updatingMember, setUpdatingMember] =
      useState(false);

  const [leavingMemberId, setLeavingMemberId] =
      useState(null);

  // ==========================================
  // PROJECT TEAM MEMBERS
  // ==========================================

  const [projectMembers, setProjectMembers] =
      useState({});

  const [projectMembersLoading, setProjectMembersLoading] =
      useState({});

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadProjects();
    loadMemberships();
    loadSkills();
    loadProjectMatches();
  }, []);

  // ==========================================
  // LOAD MY SKILLS
  // ==========================================

  const loadSkills = async () => {
    try {
      setSkillsLoading(true);

      const data = await getMySkills();

      setMySkills(
          Array.isArray(data)
              ? data
              : []
      );
    } catch (error) {
      console.error(
          "Skills error:",
          error
      );

      const message =
          error.response?.data?.message ||
          "Unable to load your skills.";

      toast.error(message);
    } finally {
      setSkillsLoading(false);
    }
  };

  // ==========================================
  // LOAD SMART PROJECT MATCHES
  // ==========================================
  const loadProjectMatches = async () => {
    try {
      setMatchesLoading(true);
      setMatchesError("");

      const data =
          await getProjectMatches();

      setProjectMatches(
          Array.isArray(data)
              ? data
              : []
      );
    } catch (error) {
      console.error(
          "Smart matching error:",
          error
      );

      const message =
          error.response?.data?.message ||
          "Unable to load smart project matches.";

      setMatchesError(message);
    } finally {
      setMatchesLoading(false);
    }
  };

  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  const loadProjects = async () => {
    try {
      setLoading(true);

      const [myProjects, available] =
          await Promise.all([
            getMyProjects(),
            getAvailableProjects(),
          ]);

      setProjects(
          Array.isArray(myProjects)
              ? myProjects
              : []
      );

      setAvailableProjects(
          Array.isArray(available)
              ? available
              : []
      );
    } catch (error) {
      console.error(
          "Projects error:",
          error
      );

      const message =
          error.response?.data?.message ||
          "Unable to load projects.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD MY MEMBERSHIPS
  // ==========================================

  const loadMemberships = async () => {
    try {
      setMembersLoading(true);

      const data =
          await getMyProjectMembers();

      setMemberships(
          Array.isArray(data)
              ? data
              : []
      );
    } catch (error) {
      console.error(
          "Project memberships error:",
          error
      );

      const message =
          error.response?.data?.message ||
          "Unable to load project memberships.";

      toast.error(message);
    } finally {
      setMembersLoading(false);
    }
  };

  // ==========================================
  // LOAD ALL MEMBERS OF A PROJECT
  // ==========================================

  const loadProjectMembers = async (
      projectId
  ) => {
    setProjectMembersLoading(
        (previous) => ({
          ...previous,
          [projectId]: true,
        })
    );

    try {
      const data =
          await getProjectMembers(projectId);

      setProjectMembers(
          (previous) => ({
            ...previous,
            [projectId]: Array.isArray(data)
                ? data
                : [],
          })
      );
    } catch (error) {
      console.error(
          "Project members error:",
          error
      );

      const message =
          error.response?.data?.message ||
          "Unable to load project members.";

      toast.error(message);
    } finally {
      setProjectMembersLoading(
          (previous) => ({
            ...previous,
            [projectId]: false,
          })
      );
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
    );
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      projectTitle: "",
      description: "",
      technologiesUsed: "",
      githubUrl: "",
      liveDemoUrl: "",
      startDate: "",
      endDate: "",
    });

    setRequiredSkills([]);
    setSelectedSkillId("");
    setSelectedSkillImportance("HIGH");
  };

  // ==========================================
  // ADD REQUIRED PROJECT SKILL
  // ==========================================

  const handleAddRequiredSkill = () => {
    if (!selectedSkillId) {
      toast.error("Please select a skill.");
      return;
    }

    const skillId = Number(selectedSkillId);

    const alreadyAdded = requiredSkills.some(
        (skill) => Number(skill.skillId) === skillId
    );

    if (alreadyAdded) {
      toast.error("This skill is already added.");
      return;
    }

    const skill = mySkills.find(
        (item) => Number(item.skillId) === skillId
    );

    if (!skill) {
      toast.error("Selected skill was not found.");
      return;
    }

    setRequiredSkills((previous) => [
      ...previous,
      {
        skillId,
        importance: selectedSkillImportance,
        skillName: skill.skillName,
      },
    ]);

    setSelectedSkillId("");
    setSelectedSkillImportance("HIGH");
  };

  // ==========================================
  // REMOVE REQUIRED PROJECT SKILL
  // ==========================================

  const handleRemoveRequiredSkill = (skillId) => {
    setRequiredSkills((previous) =>
        previous.filter(
            (skill) => Number(skill.skillId) !== Number(skillId)
        )
    );
  };

  // ==========================================
  // UPDATE REQUIRED SKILL IMPORTANCE
  // ==========================================

  const handleRequiredSkillImportanceChange = (
      skillId,
      importance
  ) => {
    setRequiredSkills((previous) =>
        previous.map((skill) =>
            Number(skill.skillId) === Number(skillId)
                ? {
                  ...skill,
                  importance,
                }
                : skill
        )
    );
  };

  // ==========================================
  // OPEN ADD PROJECT
  // ==========================================

  const openAddProject = () => {
    resetForm();
    setAddOpen(true);
  };

  // ==========================================
  // CLOSE ADD PROJECT
  // ==========================================

  const closeAddModal = () => {
    if (saving) return;

    setAddOpen(false);
    resetForm();
  };

  // ==========================================
  // ADD PROJECT
  // ==========================================

  const handleAddProject = async (
      event
  ) => {
    event.preventDefault();

    if (!formData.projectTitle.trim()) {
      toast.error(
          "Project title is required."
      );
      return;
    }

    setSaving(true);

    try {
      const newProject =
          await addProject({
            projectTitle:
                formData.projectTitle.trim(),

            description:
                formData.description.trim() ||
                null,

            technologiesUsed:
                formData.technologiesUsed.trim() ||
                null,

            githubUrl:
                formData.githubUrl.trim() ||
                null,

            liveDemoUrl:
                formData.liveDemoUrl.trim() ||
                null,

            startDate:
                formData.startDate || null,

            endDate:
                formData.endDate || null,

            requiredSkills:
                requiredSkills.map((skill) => ({
                  skillId: skill.skillId,
                  importance: skill.importance,
                })),
          });

      setProjects(
          (previous) => [
            ...previous,
            newProject,
          ]
      );

      closeAddModal();

      toast.success(
          "Project added successfully!"
      );
    } catch (error) {
      console.error(
          "Add project error:",
          error
      );

      const message =
          error.response?.data?.message ||
          "Unable to add project.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN EDIT PROJECT
  // ==========================================

  const openEditProject = (
      project
  ) => {
    setSelectedProject(project);

    setFormData({
      projectTitle:
          project.projectTitle || "",

      description:
          project.description || "",

      technologiesUsed:
          project.technologiesUsed || "",

      githubUrl:
          project.githubUrl || "",

      liveDemoUrl:
          project.liveDemoUrl || "",

      startDate:
          project.startDate || "",

      endDate:
          project.endDate || "",
    });

    setEditOpen(true);
  };

  // ==========================================
  // CLOSE EDIT PROJECT
  // ==========================================

  const closeEditModal = () => {
    if (saving) return;

    setEditOpen(false);
    setSelectedProject(null);
    resetForm();
  };

  // ==========================================
  // UPDATE PROJECT
  // ==========================================

  const handleUpdateProject =
      async (event) => {
        event.preventDefault();

        if (!selectedProject) return;

        if (!formData.projectTitle.trim()) {
          toast.error(
              "Project title is required."
          );
          return;
        }

        setSaving(true);

        try {
          const updatedProject =
              await updateProject(
                  selectedProject.id,
                  {
                    projectTitle:
                        formData.projectTitle.trim(),

                    description:
                        formData.description.trim() ||
                        null,

                    technologiesUsed:
                        formData.technologiesUsed.trim() ||
                        null,

                    githubUrl:
                        formData.githubUrl.trim() ||
                        null,

                    liveDemoUrl:
                        formData.liveDemoUrl.trim() ||
                        null,

                    startDate:
                        formData.startDate || null,

                    endDate:
                        formData.endDate || null,

                    requiredSkills:
                        requiredSkills.map((skill) => ({
                          skillId: skill.skillId,
                          importance: skill.importance,
                        })),
                  }
              );

          setProjects(
              (previous) =>
                  previous.map(
                      (project) =>
                          project.id ===
                          updatedProject.id
                              ? updatedProject
                              : project
                  )
          );

          closeEditModal();

          toast.success(
              "Project updated successfully!"
          );
        } catch (error) {
          console.error(
              "Update project error:",
              error
          );

          const message =
              error.response?.data?.message ||
              "Unable to update project.";

          toast.error(message);
        } finally {
          setSaving(false);
        }
      };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDeleteProject =
      async (project) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${project.projectTitle}"?\n\nThis will also remove its collaboration requests, members, and match history.`
            );

        if (!confirmed) return;

        setDeleting(true);

        try {
          await deleteProject(
              project.id
          );

          setProjects(
              (previous) =>
                  previous.filter(
                      (item) =>
                          item.id !== project.id
                  )
          );

          setMemberships(
              (previous) =>
                  previous.filter(
                      (item) =>
                          item.projectTitle !==
                          project.projectTitle
                  )
          );

          setProjectMembers(
              (previous) => {
                const updated = {
                  ...previous,
                };

                delete updated[project.id];

                return updated;
              }
          );

          toast.success(
              "Project deleted successfully!"
          );
        } catch (error) {
          console.error(
              "Delete project error:",
              error
          );

          const message =
              error.response?.data?.message ||
              "Unable to delete project.";

          toast.error(message);
        } finally {
          setDeleting(false);
        }
      };

  // ==========================================
  // OPEN JOIN PROJECT
  // ==========================================

  const openJoinProject = (
      projectId
  ) => {
    setJoinProjectId(projectId);
    setJoinRole("MEMBER");
  };

  // ==========================================
  // CANCEL JOIN
  // ==========================================

  const cancelJoin = () => {
    if (joining) return;

    setJoinProjectId(null);
    setJoinRole("MEMBER");
  };

  // ==========================================
  // JOIN PROJECT (sends a join request to the project owner)
  // ==========================================

  const handleJoinProject = async (projectId) => {
    setJoining(true);

    try {
      await joinProject(projectId, joinRole);

      setJoinProjectId(null);
      setJoinRole("MEMBER");

      toast.success(
          "Join request sent to the project owner!"
      );

      await loadProjects();
    } catch (error) {
      console.error("Join request error:", error);

      const message =
          error.response?.data?.message ||
          "Unable to send request.";

      toast.error(message);
    } finally {
      setJoining(false);
    }
  };

  // ==========================================
  // START EDIT MEMBER ROLE
  // ==========================================

  const startEditMember = (
      membership
  ) => {
    setEditingMemberId(
        membership.id
    );

    setEditingRole(
        membership.role
    );
  };

  // ==========================================
  // CANCEL EDIT MEMBER
  // ==========================================

  const cancelEditMember = () => {
    if (updatingMember) return;

    setEditingMemberId(null);
    setEditingRole("MEMBER");
  };

  // ==========================================
  // UPDATE MEMBER ROLE
  // ==========================================

  const handleUpdateMember =
      async (membership) => {
        setUpdatingMember(true);

        try {
          const updatedMembership =
              await updateProjectMember(
                  membership.id,
                  editingRole
              );

          setMemberships(
              (previous) =>
                  previous.map(
                      (item) =>
                          item.id ===
                          updatedMembership.id
                              ? updatedMembership
                              : item
                  )
          );

          // Refresh team members for
          // this project if already loaded
          const projectId =
              membership.projectId;

          if (
              projectId &&
              projectMembers[projectId]
          ) {
            await loadProjectMembers(
                projectId
            );
          }

          setEditingMemberId(null);

          toast.success(
              "Project role updated!"
          );
        } catch (error) {
          console.error(
              "Update project member error:",
              error
          );

          const message =
              error.response?.data?.message ||
              "Unable to update project role.";

          toast.error(message);
        } finally {
          setUpdatingMember(false);
        }
      };

  // ==========================================
  // LEAVE PROJECT
  // ==========================================

  const handleLeaveProject =
      async (membership) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to leave "${membership.projectTitle}"?`
            );

        if (!confirmed) return;

        setLeavingMemberId(
            membership.id
        );

        try {
          await leaveProject(
              membership.id
          );

          setMemberships(
              (previous) =>
                  previous.filter(
                      (item) =>
                          item.id !==
                          membership.id
                  )
          );

          toast.success(
              "You left the project."
          );
        } catch (error) {
          console.error(
              "Leave project error:",
              error
          );

          const message =
              error.response?.data?.message ||
              "Unable to leave project.";

          toast.error(message);
        } finally {
          setLeavingMemberId(null);
        }
      };

  // ==========================================
  // REMOVE PROJECT MEMBER
  // ==========================================

  const handleRemoveMember = async (
      projectId,
      memberId,
      memberName
  ) => {
    const confirmed = window.confirm(
        `Are you sure you want to remove ${memberName} from this project?`
    );

    if (!confirmed) return;

    try {
      await removeProjectMember(
          projectId,
          memberId
      );

      toast.success(
          `${memberName} removed from the project.`
      );

      // Refresh the members list if it is already open.
      await loadProjectMembers(projectId);
    } catch (error) {
      console.error(
          "Remove project member error:",
          error
      );

      const message =
          error.response?.data?.message ||
          "Unable to remove project member.";

      toast.error(message);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return null;

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
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

  // ==========================================
  // ROLE LABEL
  // ==========================================

  const getRoleLabel = (
      role
  ) => {
    const found =
        MEMBER_ROLES.find(
            (item) =>
                item.value === role
        );

    return found
        ? found.label
        : role;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <div
            className="min-h-screen
                   bg-slate-50
                   flex
                   items-center
                   justify-center"
        >
          <div className="text-center">

            <div
                className="w-10 h-10
                       border-4
                       border-blue-600
                       border-t-transparent
                       rounded-full
                       animate-spin
                       mx-auto
                       mb-4"
            />

            <p
                className="text-slate-600
                       font-medium"
            >
              Loading your projects...
            </p>

          </div>
        </div>
    );
  }

  return (
      <DashboardLayout>

        {/* ==========================================
          PAGE HEADER
      ========================================== */}

        <section
            className="flex flex-col
                   sm:flex-row
                   sm:items-center
                   justify-between
                   gap-4
                   mb-8"
        >
          <div>

            <p
                className="text-sm
                       font-medium
                       text-blue-600
                       mb-1"
            >
              Campus Projects
            </p>

            <h1
                className="text-3xl
                       font-bold
                       text-slate-900"
            >
              My Projects
            </h1>

            <p
                className="mt-2
                       text-slate-500"
            >
              Create and manage your projects
              on NEXUS.
            </p>

          </div>

          <div
              className="flex
                     flex-col
                     sm:flex-row
                     items-stretch
                     sm:items-center
                     gap-3"
          >

            <button
                type="button"
                onClick={() => navigate("/recommendations")}
                className="inline-flex
                       items-center
                       justify-center
                       gap-2
                       px-5
                       py-3
                       bg-purple-600
                       text-white
                       rounded-xl
                       font-semibold
                       hover:bg-purple-700
                       transition
                       shadow-sm"
            >
              <Sparkles size={19} />
              AI Recommendations
            </button>

            <button
                type="button"
                onClick={openAddProject}
                className="inline-flex
                       items-center
                       justify-center
                       gap-2
                       px-5
                       py-3
                       bg-blue-600
                       text-white
                       rounded-xl
                       font-semibold
                       hover:bg-blue-700
                       transition"
            >
              <Plus size={19} />
              Add Project
            </button>

          </div>

        </section>

        {/* ==========================================
          SUMMARY
      ========================================== */}

        <section
            className="grid
                   grid-cols-1
                   sm:grid-cols-3
                   gap-4
                   mb-6"
        >

          <SummaryCard
              title="My Projects"
              value={projects.length}
              icon={
                <FolderKanban
                    size={21}
                />
              }
          />

          <SummaryCard
              title="Joined Projects"
              value={memberships.length}
              icon={
                <Users size={21} />
              }
          />

          <SummaryCard
              title="Portfolio"
              value={
                projects.length > 0
                    ? "Active"
                    : "Add Project"
              }
              icon={
                <Sparkles size={21} />
              }
          />

        </section>

        {/* ==========================================
          SMART PROJECT MATCHING
      ========================================== */}

        <section
            className="mb-6
                   rounded-2xl
                   border
                   border-purple-200
                   bg-gradient-to-r
                   from-purple-50
                   via-white
                   to-blue-50
                   p-6
                   shadow-sm"
        >

          <div
              className="flex
                     flex-col
                     md:flex-row
                     md:items-center
                     md:justify-between
                     gap-5
                     mb-6"
          >

            <div
                className="flex
                       items-start
                       gap-4"
            >

              <div
                  className="w-12 h-12
                         rounded-xl
                         bg-purple-100
                         text-purple-600
                         flex
                         items-center
                         justify-center
                         shrink-0"
              >
                <Sparkles size={24} />
              </div>

              <div>

                <p
                    className="text-xs
                           font-bold
                           uppercase
                           tracking-wider
                           text-purple-600"
                >
                  NEXUS SMART MATCHING
                </p>

                <h2
                    className="text-xl
                           font-bold
                           text-slate-900
                           mt-1"
                >
                  Projects matched for you
                </h2>

                <p
                    className="text-sm
                           text-slate-600
                           mt-1
                           max-w-2xl"
                >
                  Find projects that match your skills
                  and proficiency level.
                </p>

              </div>

            </div>

            <button
                type="button"
                onClick={loadProjectMatches}
                disabled={matchesLoading}
                className="inline-flex
                       items-center
                       justify-center
                       gap-2
                       px-4
                       py-2.5
                       rounded-xl
                       border
                       border-purple-200
                       bg-white
                       text-purple-700
                       text-sm
                       font-semibold
                       hover:bg-purple-50
                       transition
                       disabled:opacity-50"
            >
              <Sparkles
                  size={16}
                  className={
                    matchesLoading
                        ? "animate-spin"
                        : ""
                  }
              />
              {matchesLoading
                  ? "Matching..."
                  : "Refresh Matches"}
            </button>

          </div>

          {matchesLoading ? (

              <div
                  className="bg-white
                       rounded-xl
                       border
                       border-purple-100
                       p-8
                       text-center"
              >
                <div
                    className="w-8 h-8
                         border-4
                         border-purple-600
                         border-t-transparent
                         rounded-full
                         animate-spin
                         mx-auto
                         mb-3"
                />

                <p
                    className="text-sm
                         font-medium
                         text-slate-600"
                >
                  Finding projects that match your skills...
                </p>
              </div>

          ) : matchesError ? (

              <div
                  className="bg-white
                       rounded-xl
                       border
                       border-red-200
                       p-6
                       text-center"
              >
                <div
                    className="w-12 h-12
                         rounded-xl
                         bg-red-50
                         text-red-600
                         flex
                         items-center
                         justify-center
                         mx-auto
                         mb-3"
                >
                  <X size={22} />
                </div>

                <h3
                    className="font-semibold
                         text-slate-800"
                >
                  Unable to load matches
                </h3>

                <p
                    className="text-sm
                         text-slate-500
                         mt-1"
                >
                  {matchesError}
                </p>

                <button
                    type="button"
                    onClick={loadProjectMatches}
                    className="mt-4
                         inline-flex
                         items-center
                         gap-2
                         px-4
                         py-2
                         rounded-lg
                         bg-purple-600
                         text-white
                         text-sm
                         font-semibold
                         hover:bg-purple-700"
                >
                  <Sparkles size={15} />
                  Try Again
                </button>
              </div>

          ) : projectMatches.length === 0 ? (

              <div
                  className="bg-white
                       rounded-xl
                       border
                       border-slate-200
                       p-8
                       text-center"
              >
                <div
                    className="w-14 h-14
                         rounded-2xl
                         bg-purple-50
                         text-purple-600
                         flex
                         items-center
                         justify-center
                         mx-auto
                         mb-4"
                >
                  <Sparkles size={26} />
                </div>

                <h3
                    className="text-base
                         font-bold
                         text-slate-900"
                >
                  No matching projects yet
                </h3>

                <p
                    className="text-sm
                         text-slate-500
                         mt-2
                         max-w-md
                         mx-auto"
                >
                  Add more skills to your profile or
                  create projects with required skills
                  to improve your Smart Matching results.
                </p>

                <div
                    className="flex
                         flex-wrap
                         justify-center
                         gap-3
                         mt-5"
                >
                  <button
                      type="button"
                      onClick={() => navigate("/skills")}
                      className="inline-flex
                           items-center
                           gap-2
                           px-4
                           py-2.5
                           rounded-xl
                           bg-blue-600
                           text-white
                           text-sm
                           font-semibold
                           hover:bg-blue-700"
                  >
                    Add Skills
                  </button>

                  <button
                      type="button"
                      onClick={openAddProject}
                      className="inline-flex
                           items-center
                           gap-2
                           px-4
                           py-2.5
                           rounded-xl
                           border
                           border-slate-300
                           text-slate-700
                           text-sm
                           font-semibold
                           hover:bg-slate-50"
                  >
                    <Plus size={16} />
                    Add Project
                  </button>
                </div>
              </div>

          ) : (

              <div>

                <div
                    className="flex
                         items-center
                         justify-between
                         gap-3
                         mb-4"
                >
                  <div>
                    <p
                        className="text-sm
                             font-semibold
                             text-slate-800"
                    >
                      {projectMatches.length}{" "}
                      {projectMatches.length === 1
                          ? "project"
                          : "projects"}{" "}
                      found
                    </p>

                    <p
                        className="text-xs
                             text-slate-500
                             mt-0.5"
                    >
                      Ranked by skill compatibility
                    </p>
                  </div>

                  <span
                      className="px-3
                           py-1.5
                           rounded-full
                           bg-purple-100
                           text-purple-700
                           text-xs
                           font-bold"
                  >
                Smart Match
              </span>
                </div>

                <div
                    className="grid
                         grid-cols-1
                         lg:grid-cols-2
                         gap-4"
                >
                  {projectMatches.map((match) => {

                    const score =
                        Number(match.matchScore || 0);

                    const safeScore =
                        Math.min(Math.max(score, 0), 100);

                    let scoreLabel = "Low Match";

                    if (score >= 80) {
                      scoreLabel = "Excellent Match";
                    } else if (score >= 60) {
                      scoreLabel = "Good Match";
                    } else if (score >= 40) {
                      scoreLabel = "Fair Match";
                    }

                    const matchedProject =
                        availableProjects.find(
                            (project) =>
                                Number(project.id) ===
                                Number(match.projectId)
                        );

                    return (
                        <div
                            key={match.matchId}
                            className="bg-white
                               rounded-xl
                               border
                               border-slate-200
                               p-5
                               hover:shadow-md
                               transition"
                        >

                          <div
                              className="flex
                                 items-start
                                 justify-between
                                 gap-4"
                          >

                            <div
                                className="flex
                                   items-start
                                   gap-3
                                   min-w-0"
                            >

                              <div
                                  className="w-11 h-11
                                     rounded-xl
                                     bg-purple-50
                                     text-purple-600
                                     flex
                                     items-center
                                     justify-center
                                     shrink-0"
                              >
                                <FolderKanban size={20} />
                              </div>

                              <div className="min-w-0">

                                <h3
                                    className="font-bold
                                       text-slate-900
                                       break-words"
                                >
                                  {match.projectTitle}
                                </h3>

                                <p
                                    className="text-xs
                                       text-slate-400
                                       mt-1"
                                >
                                  Project #{match.projectId}
                                </p>

                              </div>

                            </div>

                            <div
                                className="shrink-0
                                   text-right"
                            >
                              <p
                                  className="text-2xl
                                     font-bold
                                     text-purple-600"
                              >
                                {score.toFixed(2)}%
                              </p>

                              <p
                                  className="text-[11px]
                                     font-semibold
                                     text-slate-500"
                              >
                                {scoreLabel}
                              </p>
                            </div>

                          </div>

                          <div className="mt-5">

                            <div
                                className="flex
                                   items-center
                                   justify-between
                                   mb-2"
                            >
                        <span
                            className="text-xs
                                     font-semibold
                                     text-slate-600"
                        >
                          Skill Compatibility
                        </span>

                              <span
                                  className="text-xs
                                     font-semibold
                                     text-slate-500"
                              >
                          {score.toFixed(2)}%
                        </span>
                            </div>

                            <div
                                className="w-full
                                   h-2
                                   rounded-full
                                   bg-slate-100
                                   overflow-hidden"
                            >
                              <div
                                  className="h-full
                                     rounded-full
                                     bg-purple-600
                                     transition-all
                                     duration-500"
                                  style={{
                                    width: `${safeScore}%`,
                                  }}
                              />
                            </div>

                          </div>

                          <div
                              className="mt-5
                                 pt-4
                                 border-t
                                 border-slate-100
                                 flex
                                 items-center
                                 justify-between
                                 gap-3"
                          >

                            <div>
                              <p
                                  className="text-xs
                                     text-slate-400"
                              >
                                Match Type
                              </p>

                              <p
                                  className="text-xs
                                     font-semibold
                                     text-slate-700
                                     mt-0.5"
                              >
                                Student → Project
                              </p>
                            </div>

                            {matchedProject ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                      document
                                          .getElementById(
                                              `join-project-${match.projectId}`
                                          )
                                          ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                          });
                                    }}
                                    className="inline-flex
                                     items-center
                                     gap-2
                                     px-3.5
                                     py-2
                                     rounded-lg
                                     bg-blue-600
                                     text-white
                                     text-xs
                                     font-semibold
                                     hover:bg-blue-700
                                     transition"
                                >
                                  <UserPlus size={14} />
                                  Find Project
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        loadProjects()
                                    }
                                    className="inline-flex
                                     items-center
                                     gap-2
                                     px-3.5
                                     py-2
                                     rounded-lg
                                     border
                                     border-slate-300
                                     text-slate-700
                                     text-xs
                                     font-semibold
                                     hover:bg-slate-50
                                     transition"
                                >
                                  <FolderKanban size={14} />
                                  View Project
                                </button>
                            )}

                          </div>

                        </div>
                    );
                  })}
                </div>

              </div>

          )}

        </section>

        {/* ==========================================
          MY PROJECTS
      ========================================== */}

        <section
            className="bg-white
                   rounded-2xl
                   border
                   border-slate-200
                   p-6"
        >

          <div className="mb-6">

            <h2
                className="text-lg
                       font-bold
                       text-slate-900"
            >
              Your Projects
            </h2>

            <p
                className="text-sm
                       text-slate-500
                       mt-1"
            >
              Projects you have created.
            </p>

          </div>

          {projects.length === 0 ? (

              <div
                  className="py-16
                       text-center"
              >

                <div
                    className="w-16 h-16
                         rounded-2xl
                         bg-blue-50
                         text-blue-600
                         flex
                         items-center
                         justify-center
                         mx-auto
                         mb-4"
                >
                  <FolderKanban
                      size={30}
                  />
                </div>

                <h3
                    className="text-lg
                         font-bold
                         text-slate-900"
                >
                  No projects yet
                </h3>

                <p
                    className="text-sm
                         text-slate-500
                         mt-2
                         max-w-md
                         mx-auto"
                >
                  Add your first project to build
                  your NEXUS project portfolio.
                </p>

                <button
                    onClick={
                      openAddProject
                    }
                    className="mt-5
                         inline-flex
                         items-center
                         gap-2
                         px-4
                         py-2.5
                         bg-blue-600
                         text-white
                         rounded-xl
                         text-sm
                         font-semibold
                         hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Your First Project
                </button>

              </div>

          ) : (

              <div
                  className="grid
                       grid-cols-1
                       lg:grid-cols-2
                       gap-5"
              >

                {projects.map(
                    (project) => (

                        <div
                            key={project.id}
                            className="border
                             border-slate-200
                             rounded-2xl
                             p-6
                             hover:shadow-md
                             transition"
                        >

                          {/* PROJECT HEADER */}

                          <div
                              className="flex
                               items-start
                               justify-between
                               gap-3"
                          >

                            <div
                                className="flex
                                 items-start
                                 gap-3
                                 min-w-0"
                            >

                              <div
                                  className="w-12 h-12
                                   rounded-xl
                                   bg-blue-50
                                   text-blue-600
                                   flex
                                   items-center
                                   justify-center
                                   shrink-0"
                              >
                                <FolderKanban
                                    size={23}
                                />
                              </div>

                              <div
                                  className="min-w-0"
                              >

                                <h3
                                    className="text-lg
                                     font-bold
                                     text-slate-900
                                     break-words"
                                >
                                  {
                                    project.projectTitle
                                  }
                                </h3>

                                <p
                                    className="text-xs
                                     text-slate-400
                                     mt-1"
                                >
                                  Project #{project.id}
                                </p>

                              </div>

                            </div>

                            {/* ACTION BUTTONS */}

                            <div
                                className="flex
                                 gap-1
                                 shrink-0"
                            >

                              <button
                                  onClick={() =>
                                      openEditProject(
                                          project
                                      )
                                  }
                                  className="p-2
                                   rounded-lg
                                   text-slate-500
                                   hover:bg-blue-50
                                   hover:text-blue-600
                                   transition"
                                  title="Edit project"
                              >
                                <Pencil
                                    size={17}
                                />
                              </button>

                              <button
                                  onClick={() =>
                                      handleDeleteProject(
                                          project
                                      )
                                  }
                                  disabled={
                                    deleting
                                  }
                                  className="p-2
                                   rounded-lg
                                   text-slate-500
                                   hover:bg-red-50
                                   hover:text-red-600
                                   transition
                                   disabled:opacity-50"
                                  title="Delete project"
                              >
                                <Trash2
                                    size={17}
                                />
                              </button>

                            </div>

                          </div>

                          {/* DESCRIPTION */}

                          {project.description && (
                              <p
                                  className="mt-5
                                 text-sm
                                 text-slate-600
                                 leading-relaxed"
                              >
                                {
                                  project.description
                                }
                              </p>
                          )}

                          {/* TECHNOLOGIES */}

                          {project.technologiesUsed && (
                              <div
                                  className="mt-5"
                              >

                                <p
                                    className="text-xs
                                   font-semibold
                                   text-slate-500
                                   uppercase
                                   tracking-wide
                                   mb-2"
                                >
                                  Technologies
                                </p>

                                <div
                                    className="flex
                                   flex-wrap
                                   gap-2"
                                >

                                  {project
                                      .technologiesUsed
                                      .split(",")
                                      .map(
                                          (
                                              technology,
                                              index
                                          ) => (
                                              <span
                                                  key={`${technology}-${index}`}
                                                  className="px-3
                                           py-1.5
                                           rounded-lg
                                           bg-slate-100
                                           text-slate-700
                                           text-xs
                                           font-medium"
                                              >
                                {
                                  technology.trim()
                                }
                              </span>
                                          )
                                      )}

                                </div>

                              </div>
                          )}

                          {/* DATES */}

                          {(project.startDate ||
                              project.endDate) && (
                              <div
                                  className="mt-5
                                 flex
                                 flex-wrap
                                 gap-4"
                              >

                                {project.startDate && (
                                    <div
                                        className="flex
                                     items-center
                                     gap-2
                                     text-xs
                                     text-slate-500"
                                    >
                                      <CalendarDays
                                          size={15}
                                      />

                                      <span>
                            Start:{" "}

                                        <span
                                            className="font-medium
                                         text-slate-700"
                                        >
                              {formatDate(
                                  project.startDate
                              )}
                            </span>

                          </span>

                                    </div>
                                )}

                                {project.endDate && (
                                    <div
                                        className="flex
                                     items-center
                                     gap-2
                                     text-xs
                                     text-slate-500"
                                    >

                                      <CalendarDays
                                          size={15}
                                      />

                                      <span>
                            End:{" "}

                                        <span
                                            className="font-medium
                                         text-slate-700"
                                        >
                              {formatDate(
                                  project.endDate
                              )}
                            </span>

                          </span>

                                    </div>
                                )}

                              </div>
                          )}

                          {/* ==========================================
                      PROJECT MEMBERS
                  ========================================== */}

                          <div
                              className="mt-6
                               pt-5
                               border-t
                               border-slate-100"
                          >

                            <div
                                className="flex
                                 items-center
                                 justify-between
                                 gap-3"
                            >

                              <div
                                  className="flex
                                   items-center
                                   gap-2"
                              >

                                <Users
                                    size={17}
                                    className="text-blue-600"
                                />

                                <p
                                    className="text-sm
                                     font-semibold
                                     text-slate-800"
                                >
                                  Team Members
                                </p>

                                {projectMembers[
                                    project.id
                                    ] && (
                                    <span
                                        className="px-2
                                       py-0.5
                                       rounded-full
                                       bg-blue-50
                                       text-blue-700
                                       text-xs
                                       font-semibold"
                                    >
                            {
                              projectMembers[
                                  project.id
                                  ].length
                            }
                          </span>
                                )}

                              </div>

                              <button
                                  onClick={() =>
                                      loadProjectMembers(
                                          project.id
                                      )
                                  }
                                  disabled={
                                    projectMembersLoading[
                                        project.id
                                        ]
                                  }
                                  className="inline-flex
                                   items-center
                                   gap-1.5
                                   px-3
                                   py-1.5
                                   rounded-lg
                                   border
                                   border-slate-300
                                   text-slate-600
                                   text-xs
                                   font-semibold
                                   hover:bg-slate-50
                                   disabled:opacity-50"
                              >

                                <Users
                                    size={14}
                                />

                                {projectMembersLoading[
                                    project.id
                                    ]
                                    ? "Loading..."
                                    : projectMembers[
                                        project.id
                                        ]
                                        ? "Refresh"
                                        : "View Members"}

                              </button>

                            </div>

                            {/* MEMBERS LIST */}

                            {projectMembers[
                                project.id
                                ] && (

                                <div
                                    className="mt-4
                                   space-y-2"
                                >

                                  {projectMembers[
                                      project.id
                                      ].length === 0 ? (

                                      <div
                                          className="p-4
                                       rounded-xl
                                       bg-slate-50
                                       text-center"
                                      >

                                        <p
                                            className="text-sm
                                         text-slate-500"
                                        >
                                          No members found.
                                        </p>

                                      </div>

                                  ) : (

                                      projectMembers[
                                          project.id
                                          ].map(
                                          (member) => (

                                              <div
                                                  key={
                                                    member.id
                                                  }
                                                  className="flex
                                           items-center
                                           justify-between
                                           gap-3
                                           p-3
                                           rounded-xl
                                           bg-slate-50"
                                              >

                                                <div
                                                    className="flex
                                             items-center
                                             gap-3
                                             min-w-0"
                                                >

                                                  <div
                                                      className="w-9 h-9
                                               rounded-lg
                                               bg-blue-100
                                               text-blue-700
                                               flex
                                               items-center
                                               justify-center
                                               shrink-0"
                                                  >
                                                    <Users
                                                        size={17}
                                                    />
                                                  </div>

                                                  <div
                                                      className="min-w-0"
                                                  >

                                                    <p
                                                        className="text-sm
                                                 font-semibold
                                                 text-slate-800
                                                 truncate"
                                                    >
                                                      {
                                                        member.studentName
                                                      }
                                                    </p>

                                                    <p
                                                        className="text-xs
                                                 text-slate-500
                                                 truncate"
                                                    >
                                                      {
                                                        member.studentEmail
                                                      }
                                                    </p>

                                                  </div>

                                                </div>

                                                <div
                                                    className="flex
                                            items-center
                                            gap-2
                                            shrink-0"
                                                >

                                  <span
                                      className="px-2.5
                                               py-1
                                               rounded-lg
                                               bg-blue-50
                                               text-blue-700
                                               text-xs
                                               font-semibold
                                               whitespace-nowrap"
                                  >
                                    {getRoleLabel(
                                        member.role
                                    )}
                                  </span>

                                                  {member.role !== "LEADER" && (
                                                      <button
                                                          type="button"
                                                          onClick={() =>
                                                              handleRemoveMember(
                                                                  project.id,
                                                                  member.id,
                                                                  member.studentName
                                                              )
                                                          }
                                                          className="inline-flex
                                                 items-center
                                                 gap-1.5
                                                 px-2.5
                                                 py-1.5
                                                 rounded-lg
                                                 border
                                                 border-red-200
                                                 text-red-600
                                                 text-xs
                                                 font-semibold
                                                 hover:bg-red-50
                                                 transition"
                                                          title="Remove member"
                                                      >
                                                        <Trash2 size={13} />
                                                        Remove
                                                      </button>
                                                  )}

                                                </div>

                                              </div>

                                          )
                                      )

                                  )}

                                </div>
                            )}

                          </div>

                          {/* LINKS */}

                          {(project.githubUrl ||
                              project.liveDemoUrl) && (
                              <div
                                  className="mt-6
                                 pt-5
                                 border-t
                                 border-slate-100
                                 flex
                                 flex-wrap
                                 gap-3"
                              >

                                {project.githubUrl && (
                                    <a
                                        href={
                                          project.githubUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex
                                     items-center
                                     gap-2
                                     px-3.5
                                     py-2
                                     rounded-lg
                                     bg-slate-900
                                     text-white
                                     text-xs
                                     font-semibold
                                     hover:bg-slate-800
                                     transition"
                                    >
                                      <ExternalLink
                                          size={15}
                                      />
                                      GitHub
                                    </a>
                                )}

                                {project.liveDemoUrl && (
                                    <a
                                        href={
                                          project.liveDemoUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex
                                     items-center
                                     gap-2
                                     px-3.5
                                     py-2
                                     rounded-lg
                                     bg-blue-600
                                     text-white
                                     text-xs
                                     font-semibold
                                     hover:bg-blue-700
                                     transition"
                                    >
                                      <ExternalLink
                                          size={15}
                                      />
                                      Live Demo
                                    </a>
                                )}

                              </div>
                          )}

                        </div>
                    )
                )}

              </div>
          )}

        </section>

        {/* ==========================================
          MY PROJECT MEMBERSHIPS
      ========================================== */}

        <section
            className="bg-white
                   rounded-2xl
                   border
                   border-slate-200
                   p-6
                   mt-6"
        >

          <div
              className="flex
                     items-center
                     gap-3
                     mb-6"
          >

            <div
                className="p-3
                       rounded-xl
                       bg-purple-50
                       text-purple-600"
            >
              <Users
                  size={21}
              />
            </div>

            <div>

              <h2
                  className="text-lg
                         font-bold
                         text-slate-900"
              >
                My Project Memberships
              </h2>

              <p
                  className="text-sm
                         text-slate-500
                         mt-1"
              >
                Projects you have joined as a member.
              </p>

            </div>

          </div>

          {membersLoading ? (

              <div
                  className="py-10
                       text-center"
              >

                <div
                    className="w-8 h-8
                         border-4
                         border-blue-600
                         border-t-transparent
                         rounded-full
                         animate-spin
                         mx-auto
                         mb-3"
                />

                <p
                    className="text-sm
                         text-slate-500"
                >
                  Loading memberships...
                </p>

              </div>

          ) : memberships.length === 0 ? (

              <div
                  className="py-12
                       text-center
                       bg-slate-50
                       rounded-xl"
              >

                <Users
                    size={32}
                    className="mx-auto
                         text-slate-400
                         mb-3"
                />

                <h3
                    className="font-semibold
                         text-slate-800"
                >
                  No project memberships
                </h3>

                <p
                    className="text-sm
                         text-slate-500
                         mt-1"
                >
                  Join a project above to see it here.
                </p>

              </div>

          ) : (

              <div
                  className="space-y-3"
              >

                {memberships.map(
                    (membership) => (

                        <div
                            key={membership.id}
                            className="border
                             border-slate-200
                             rounded-xl
                             p-4"
                        >

                          <div
                              className="flex
                               flex-col
                               sm:flex-row
                               sm:items-center
                               justify-between
                               gap-4"
                          >

                            <div
                                className="flex
                                 items-center
                                 gap-3"
                            >

                              <div
                                  className="w-11 h-11
                                   rounded-xl
                                   bg-purple-50
                                   text-purple-600
                                   flex
                                   items-center
                                   justify-center
                                   shrink-0"
                              >
                                <Users
                                    size={20}
                                />
                              </div>

                              <div>

                                <h3
                                    className="font-semibold
                                     text-slate-900"
                                >
                                  {
                                    membership.projectTitle
                                  }
                                </h3>

                                <p
                                    className="text-xs
                                     text-slate-500
                                     mt-1"
                                >
                                  Joined{" "}

                                  {formatDate(
                                      membership.joinedAt
                                  )}

                                </p>

                              </div>

                            </div>

                            {/* ROLE */}

                            {editingMemberId ===
                            membership.id ? (

                                <div
                                    className="flex
                                   flex-col
                                   sm:flex-row
                                   gap-2"
                                >

                                  <select
                                      value={
                                        editingRole
                                      }
                                      onChange={(
                                          event
                                      ) =>
                                          setEditingRole(
                                              event.target.value
                                          )
                                      }
                                      disabled={
                                        updatingMember
                                      }
                                      className="px-3
                                     py-2
                                     rounded-lg
                                     border
                                     border-slate-300
                                     text-sm
                                     focus:outline-none
                                     focus:ring-2
                                     focus:ring-blue-500"
                                  >

                                    {MEMBER_ROLES.map(
                                        (role) => (
                                            <option
                                                key={
                                                  role.value
                                                }
                                                value={
                                                  role.value
                                                }
                                            >
                                              {
                                                role.label
                                              }
                                            </option>
                                        )
                                    )}

                                  </select>

                                  <button
                                      onClick={() =>
                                          handleUpdateMember(
                                              membership
                                          )
                                      }
                                      disabled={
                                        updatingMember
                                      }
                                      className="inline-flex
                                     items-center
                                     justify-center
                                     gap-2
                                     px-3
                                     py-2
                                     rounded-lg
                                     bg-blue-600
                                     text-white
                                     text-sm
                                     font-semibold
                                     hover:bg-blue-700
                                     disabled:opacity-50"
                                  >
                                    <Save
                                        size={15}
                                    />
                                    Save
                                  </button>

                                  <button
                                      onClick={
                                        cancelEditMember
                                      }
                                      disabled={
                                        updatingMember
                                      }
                                      className="px-3
                                     py-2
                                     rounded-lg
                                     border
                                     border-slate-300
                                     text-slate-600
                                     text-sm
                                     font-semibold
                                     hover:bg-slate-50"
                                  >
                                    Cancel
                                  </button>

                                </div>

                            ) : (

                                <div
                                    className="flex
                                   flex-wrap
                                   items-center
                                   gap-2"
                                >

                        <span
                            className="px-3
                                     py-1.5
                                     rounded-lg
                                     bg-blue-50
                                     text-blue-700
                                     text-xs
                                     font-semibold"
                        >
                          {getRoleLabel(
                              membership.role
                          )}
                        </span>

                                  <button
                                      onClick={() =>
                                          startEditMember(
                                              membership
                                          )
                                      }
                                      className="inline-flex
                                     items-center
                                     gap-1.5
                                     px-3
                                     py-1.5
                                     rounded-lg
                                     border
                                     border-slate-300
                                     text-slate-600
                                     text-xs
                                     font-semibold
                                     hover:bg-slate-50"
                                  >
                                    <Pencil
                                        size={13}
                                    />
                                    Edit Role
                                  </button>

                                  <button
                                      onClick={() =>
                                          handleLeaveProject(
                                              membership
                                          )
                                      }
                                      disabled={
                                          leavingMemberId ===
                                          membership.id
                                      }
                                      className="inline-flex
                                     items-center
                                     gap-1.5
                                     px-3
                                     py-1.5
                                     rounded-lg
                                     border
                                     border-red-200
                                     text-red-600
                                     text-xs
                                     font-semibold
                                     hover:bg-red-50
                                     disabled:opacity-50"
                                  >
                                    <LogOut
                                        size={13}
                                    />

                                    {leavingMemberId ===
                                    membership.id
                                        ? "Leaving..."
                                        : "Leave"}

                                  </button>

                                </div>

                            )}

                          </div>

                        </div>

                    )
                )}

              </div>

          )}

        </section>

        {/* ==========================================
          JOIN PROJECT SECTION
      ========================================== */}

        <section
            className="bg-white
                   rounded-2xl
                   border
                   border-slate-200
                   p-6
                   mt-6"
        >

          <div
              className="flex
                     items-center
                     gap-3
                     mb-6"
          >

            <div
                className="p-3
                       rounded-xl
                       bg-green-50
                       text-green-600"
            >
              <UserPlus
                  size={21}
              />
            </div>

            <div>

              <h2
                  className="text-lg
                         font-bold
                         text-slate-900"
              >
                Join a Project
              </h2>

              <p
                  className="text-sm
                         text-slate-500
                         mt-1"
              >
                Join one of your available campus projects.
              </p>

            </div>

          </div>

          {availableProjects.length === 0 ? (

              <div
                  className="p-5
                       rounded-xl
                       bg-slate-50
                       text-sm
                       text-slate-500"
              >
                No projects are currently available to
                join.
              </div>

          ) : (

              <div
                  className="grid
                       grid-cols-1
                       lg:grid-cols-2
                       gap-4"
              >

                {availableProjects.map(
                    (project) => {

                      const alreadyJoined =
                          memberships.some(
                              (membership) =>
                                  membership.projectTitle ===
                                  project.projectTitle
                          );

                      return (
                          <div
                              id={`join-project-${project.id}`}
                              key={`join-${project.id}`}
                              className="border
                               border-slate-200
                               rounded-xl
                               p-5"
                          >

                            <div
                                className="flex
                                 items-start
                                 justify-between
                                 gap-3"
                            >

                              <div>

                                <h3
                                    className="font-semibold
                                     text-slate-900"
                                >
                                  {
                                    project.projectTitle
                                  }
                                </h3>

                                {project.description && (
                                    <p
                                        className="text-sm
                                       text-slate-500
                                       mt-1
                                       line-clamp-2"
                                    >
                                      {
                                        project.description
                                      }
                                    </p>
                                )}

                              </div>

                              <FolderKanban
                                  size={20}
                                  className="text-blue-600
                                   shrink-0"
                              />

                            </div>

                            {joinProjectId ===
                            project.id ? (

                                <div
                                    className="mt-4
                                   pt-4
                                   border-t
                                   border-slate-200"
                                >

                                  <label
                                      className="block
                                     text-xs
                                     font-semibold
                                     text-slate-600
                                     mb-2"
                                  >
                                    Select your role
                                  </label>

                                  <select
                                      value={joinRole}
                                      onChange={(
                                          event
                                      ) =>
                                          setJoinRole(
                                              event.target.value
                                          )
                                      }
                                      disabled={
                                        joining
                                      }
                                      className="w-full
                                     px-3
                                     py-2.5
                                     rounded-lg
                                     border
                                     border-slate-300
                                     text-sm
                                     focus:outline-none
                                     focus:ring-2
                                     focus:ring-blue-500"
                                  >

                                    {MEMBER_ROLES.map(
                                        (role) => (
                                            <option
                                                key={
                                                  role.value
                                                }
                                                value={
                                                  role.value
                                                }
                                            >
                                              {
                                                role.label
                                              }
                                            </option>
                                        )
                                    )}

                                  </select>

                                  <div
                                      className="flex
                                     gap-2
                                     mt-3"
                                  >

                                    <button
                                        onClick={() =>
                                            handleJoinProject(
                                                project.id
                                            )
                                        }
                                        disabled={
                                          joining
                                        }
                                        className="flex-1
                                       inline-flex
                                       items-center
                                       justify-center
                                       gap-2
                                       px-4
                                       py-2.5
                                       bg-blue-600
                                       text-white
                                       rounded-lg
                                       text-sm
                                       font-semibold
                                       hover:bg-blue-700
                                       disabled:opacity-50"
                                    >

                                      <UserPlus
                                          size={16}
                                      />

                                      {joining
                                          ? "Sending..."
                                          : "Send Request"}

                                    </button>

                                    <button
                                        onClick={
                                          cancelJoin
                                        }
                                        disabled={
                                          joining
                                        }
                                        className="px-4
                                       py-2.5
                                       rounded-lg
                                       border
                                       border-slate-300
                                       text-slate-600
                                       text-sm
                                       font-semibold
                                       hover:bg-slate-50"
                                    >
                                      Cancel
                                    </button>

                                  </div>

                                </div>

                            ) : alreadyJoined ? (

                                <div
                                    className="mt-4
                                   px-3
                                   py-2.5
                                   rounded-lg
                                   bg-green-50
                                   text-green-700
                                   text-xs
                                   font-semibold
                                   text-center"
                                >
                                  Already a member
                                </div>

                            ) : (

                                <button
                                    onClick={() =>
                                        openJoinProject(
                                            project.id
                                        )
                                    }
                                    className="mt-4
                                   w-full
                                   inline-flex
                                   items-center
                                   justify-center
                                   gap-2
                                   px-4
                                   py-2.5
                                   rounded-lg
                                   bg-blue-600
                                   text-white
                                   text-sm
                                   font-semibold
                                   hover:bg-blue-700
                                   transition"
                                >
                                  <UserPlus size={16} />
                                  Request to Join
                                </button>
                            )}

                          </div>
                      );
                    }
                )}

              </div>
          )}

        </section>

        {/* ==========================================
          ADD PROJECT MODAL
      ========================================== */}

        {addOpen && (
            <ProjectModal
                title="Add Project"
                subtitle="Add your project details to NEXUS."
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleAddProject}
                onClose={closeAddModal}
                saving={saving}
                submitText="Add Project"
                mySkills={mySkills}
                requiredSkills={requiredSkills}
                selectedSkillId={selectedSkillId}
                selectedSkillImportance={selectedSkillImportance}
                skillsLoading={skillsLoading}
                setSelectedSkillId={setSelectedSkillId}
                setSelectedSkillImportance={setSelectedSkillImportance}
                handleAddRequiredSkill={handleAddRequiredSkill}
                handleRemoveRequiredSkill={handleRemoveRequiredSkill}
                handleRequiredSkillImportanceChange={
                  handleRequiredSkillImportanceChange
                }
            />
        )}

        {/* ==========================================
          EDIT PROJECT MODAL
      ========================================== */}

        {editOpen && (
            <ProjectModal
                title="Edit Project"
                subtitle="Update your project information."
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleUpdateProject}
                onClose={closeEditModal}
                saving={saving}
                submitText="Save Changes"
                mySkills={mySkills}
                requiredSkills={requiredSkills}
                selectedSkillId={selectedSkillId}
                selectedSkillImportance={selectedSkillImportance}
                skillsLoading={skillsLoading}
                setSelectedSkillId={setSelectedSkillId}
                setSelectedSkillImportance={setSelectedSkillImportance}
                handleAddRequiredSkill={handleAddRequiredSkill}
                handleRemoveRequiredSkill={handleRemoveRequiredSkill}
                handleRequiredSkillImportanceChange={
                  handleRequiredSkillImportanceChange
                }
            />
        )}

      </DashboardLayout>
  );
};

// ==========================================
// PROJECT MODAL
// ==========================================

const ProjectModal = ({
                        title,
                        subtitle,
                        formData,
                        handleChange,
                        handleSubmit,
                        onClose,
                        saving,
                        submitText,
                        mySkills,
                        requiredSkills,
                        selectedSkillId,
                        selectedSkillImportance,
                        skillsLoading,
                        setSelectedSkillId,
                        setSelectedSkillImportance,
                        handleAddRequiredSkill,
                        handleRemoveRequiredSkill,
                        handleRequiredSkillImportanceChange,
                      }) => {
  return (
      <div
          className="fixed
                 inset-0
                 z-[100]
                 bg-black/50
                 flex
                 items-center
                 justify-center
                 p-4"
          onMouseDown={(event) => {
            if (
                event.target ===
                event.currentTarget
            ) {
              onClose();
            }
          }}
      >

        <div
            className="w-full
                   max-w-2xl
                   max-h-[90vh]
                   overflow-y-auto
                   bg-white
                   rounded-2xl
                   shadow-2xl"
        >

          {/* HEADER */}

          <div
              className="sticky
                     top-0
                     z-10
                     bg-white
                     flex
                     items-center
                     justify-between
                     px-6
                     py-5
                     border-b
                     border-slate-200"
          >

            <div>

              <h2
                  className="text-xl
                         font-bold
                         text-slate-900"
              >
                {title}
              </h2>

              <p
                  className="text-sm
                         text-slate-500
                         mt-1"
              >
                {subtitle}
              </p>

            </div>

            <button
                onClick={onClose}
                disabled={saving}
                className="p-2
                       rounded-lg
                       hover:bg-slate-100
                       text-slate-500
                       disabled:opacity-50"
            >
              <X size={20} />
            </button>

          </div>

          {/* FORM */}

          <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
          >

            <FormField
                label="Project Title"
                required
            >
              <input
                  name="projectTitle"
                  type="text"
                  value={
                    formData.projectTitle
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Smart Queue Management"
                  className="input-field"
              />
            </FormField>

            <FormField label="Description">
            <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Describe your project..."
                rows={4}
                className="input-field resize-none"
            />
            </FormField>

            <FormField label="Technologies Used">
              <input
                  name="technologiesUsed"
                  type="text"
                  value={
                    formData.technologiesUsed
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Java, Spring Boot, PostgreSQL, React"
                  className="input-field"
              />

              <p
                  className="text-xs
                         text-slate-400
                         mt-1"
              >
                Separate technologies with commas.
              </p>
            </FormField>

            {/* ==========================================
              REQUIRED PROJECT SKILLS
          ========================================== */}

            <div
                className="rounded-2xl
                       border
                       border-slate-200
                       bg-slate-50
                       p-5"
            >

              <div className="mb-4">
                <h3
                    className="text-sm
                           font-bold
                           text-slate-800"
                >
                  Required Project Skills
                </h3>

                <p
                    className="text-xs
                           text-slate-500
                           mt-1"
                >
                  Select skills that are required for this project.
                  These skills are used by NEXUS Smart Matching.
                </p>
              </div>

              <div
                  className="grid
                         grid-cols-1
                         md:grid-cols-[1fr_160px_auto]
                         gap-3
                         items-end"
              >

                <FormField label="Skill">
                  <select
                      value={selectedSkillId}
                      onChange={(event) =>
                          setSelectedSkillId(event.target.value)
                      }
                      disabled={skillsLoading || saving}
                      className="input-field"
                  >
                    <option value="">
                      {skillsLoading
                          ? "Loading your skills..."
                          : mySkills.length === 0
                              ? "No skills added to your profile"
                              : "Select a skill"}
                    </option>

                    {mySkills
                        .filter(
                            (skill) =>
                                !requiredSkills.some(
                                    (selected) =>
                                        Number(selected.skillId) ===
                                        Number(skill.skillId)
                                )
                        )
                        .map((skill) => (
                            <option
                                key={skill.skillId}
                                value={skill.skillId}
                            >
                              {skill.skillName}
                            </option>
                        ))}
                  </select>
                </FormField>

                <FormField label="Importance">
                  <select
                      value={selectedSkillImportance}
                      onChange={(event) =>
                          setSelectedSkillImportance(
                              event.target.value
                          )
                      }
                      disabled={saving}
                      className="input-field"
                  >
                    {SKILL_IMPORTANCE.map(
                        (importance) => (
                            <option
                                key={importance.value}
                                value={importance.value}
                            >
                              {importance.label}
                            </option>
                        )
                    )}
                  </select>
                </FormField>

                <button
                    type="button"
                    onClick={handleAddRequiredSkill}
                    disabled={
                        saving ||
                        skillsLoading ||
                        mySkills.length === 0 ||
                        !selectedSkillId
                    }
                    className="inline-flex
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
                           disabled:opacity-50
                           disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  Add Skill
                </button>

              </div>

              {mySkills.length === 0 && !skillsLoading && (
                  <div
                      className="mt-4
                           rounded-xl
                           bg-amber-50
                           border
                           border-amber-200
                           p-3
                           text-xs
                           text-amber-700"
                  >
                    Add skills to your NEXUS profile first.
                    You can then select them as required skills
                    for this project.
                  </div>
              )}

              {requiredSkills.length > 0 && (
                  <div
                      className="mt-4
                           space-y-2"
                  >
                    {requiredSkills.map((skill) => (
                        <div
                            key={skill.skillId}
                            className="flex
                               flex-col
                               sm:flex-row
                               sm:items-center
                               justify-between
                               gap-3
                               rounded-xl
                               border
                               border-slate-200
                               bg-white
                               p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9
                                   rounded-lg
                                   bg-blue-50
                                   text-blue-600
                                   flex
                                   items-center
                                   justify-center
                                   shrink-0"
                            >
                              <Sparkles size={16} />
                            </div>

                            <div>
                              <p
                                  className="text-sm
                                     font-semibold
                                     text-slate-800"
                              >
                                {skill.skillName}
                              </p>

                              <p
                                  className="text-xs
                                     text-slate-400
                                     mt-0.5"
                              >
                                Required skill
                              </p>
                            </div>
                          </div>

                          <div
                              className="flex
                                 items-center
                                 gap-2"
                          >
                            <select
                                value={skill.importance}
                                onChange={(event) =>
                                    handleRequiredSkillImportanceChange(
                                        skill.skillId,
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                                className="px-3
                                   py-2
                                   rounded-lg
                                   border
                                   border-slate-300
                                   text-xs
                                   font-medium
                                   text-slate-700
                                   focus:outline-none
                                   focus:ring-2
                                   focus:ring-blue-500"
                            >
                              {SKILL_IMPORTANCE.map(
                                  (importance) => (
                                      <option
                                          key={importance.value}
                                          value={importance.value}
                                      >
                                        {importance.label}
                                      </option>
                                  )
                              )}
                            </select>

                            <button
                                type="button"
                                onClick={() =>
                                    handleRemoveRequiredSkill(
                                        skill.skillId
                                    )
                                }
                                disabled={saving}
                                className="p-2
                                   rounded-lg
                                   text-slate-400
                                   hover:bg-red-50
                                   hover:text-red-600
                                   transition
                                   disabled:opacity-50"
                                title="Remove required skill"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}

            </div>

            <div
                className="grid
                       grid-cols-1
                       md:grid-cols-2
                       gap-4"
            >

              <FormField label="GitHub URL">
                <input
                    name="githubUrl"
                    type="url"
                    value={
                      formData.githubUrl
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://github.com/..."
                    className="input-field"
                />
              </FormField>

              <FormField label="Live Demo URL">
                <input
                    name="liveDemoUrl"
                    type="url"
                    value={
                      formData.liveDemoUrl
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://..."
                    className="input-field"
                />
              </FormField>

            </div>

            <div
                className="grid
                       grid-cols-1
                       md:grid-cols-2
                       gap-4"
            >

              <FormField label="Start Date">
                <input
                    name="startDate"
                    type="date"
                    value={
                      formData.startDate
                    }
                    onChange={
                      handleChange
                    }
                    className="input-field"
                />
              </FormField>

              <FormField label="End Date">
                <input
                    name="endDate"
                    type="date"
                    value={
                      formData.endDate
                    }
                    onChange={
                      handleChange
                    }
                    className="input-field"
                />
              </FormField>

            </div>

            {/* BUTTONS */}

            <div
                className="flex
                       justify-end
                       gap-3
                       pt-5
                       border-t
                       border-slate-200"
            >

              <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-5
                         py-2.5
                         rounded-xl
                         border
                         border-slate-300
                         text-slate-700
                         font-semibold
                         hover:bg-slate-50
                         disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                  type="submit"
                  disabled={saving}
                  className="flex
                         items-center
                         gap-2
                         px-5
                         py-2.5
                         rounded-xl
                         bg-blue-600
                         text-white
                         font-semibold
                         hover:bg-blue-700
                         disabled:opacity-60"
              >

                {saving ? (
                    <>
                      <div
                          className="w-4 h-4
                               border-2
                               border-white
                               border-t-transparent
                               rounded-full
                               animate-spin"
                      />

                      Saving...
                    </>
                ) : (
                    <>
                      <Save
                          size={17}
                      />
                      {submitText}
                    </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>
  );
};

// ==========================================
// SUMMARY CARD
// ==========================================

const SummaryCard = ({
                       title,
                       value,
                       icon,
                     }) => {
  return (
      <div
          className="bg-white
                 rounded-2xl
                 border
                 border-slate-200
                 p-5"
      >

        <div
            className="flex
                   items-center
                   justify-between"
        >

          <div>

            <p
                className="text-sm
                       text-slate-500"
            >
              {title}
            </p>

            <p
                className="text-2xl
                       font-bold
                       text-slate-900
                       mt-2"
            >
              {value}
            </p>

          </div>

          <div
              className="p-3
                     rounded-xl
                     bg-blue-50
                     text-blue-600"
          >
            {icon}
          </div>

        </div>

      </div>
  );
};

// ==========================================
// FORM FIELD
// ==========================================

const FormField = ({
                     label,
                     required = false,
                     children,
                   }) => {
  return (
      <div>

        <label
            className="block
                   text-sm
                   font-semibold
                   text-slate-700
                   mb-2"
        >

          {label}

          {required && (
              <span
                  className="text-red-500
                       ml-1"
              >
            *
          </span>
          )}

        </label>

        {children}

      </div>
  );
};

export default Projects;
