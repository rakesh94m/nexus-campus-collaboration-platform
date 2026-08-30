import { useEffect, useState } from "react";

import {
  Search,
  Users,
  User,
  Mail,
  GraduationCap,
  MapPin,
  Eye,
  RefreshCw,
  X,
  Send,
  FolderKanban,
  ExternalLink,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getAllStudents,
  getStudentById,
} from "../../services/studentService";

import {
  getMyProjects,
} from "../../services/projectService";

import {
  sendCollaborationRequest,
} from "../../services/collaborationService";

const Students = () => {

  // ==========================================
  // STUDENTS
  // ==========================================

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ==========================================
  // COLLABORATION REQUEST
  // ==========================================

  const [requestOpen, setRequestOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [requestedRole, setRequestedRole] = useState("MEMBER");
  const [requestMessage, setRequestMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Students error:", error);
      const message = error.response?.data?.message || "Unable to load students.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents = students.filter((student) => {
    const searchText = search.trim().toLowerCase();
    if (!searchText) return true;
    return (
      student.fullName?.toLowerCase().includes(searchText) ||
      student.rollNumber?.toLowerCase().includes(searchText) ||
      student.department?.toLowerCase().includes(searchText) ||
      student.branch?.toLowerCase().includes(searchText) ||
      student.email?.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // VIEW STUDENT
  // ==========================================

  const handleViewStudent = async (id) => {
    try {
      setProfileLoading(true);
      const student = await getStudentById(id);
      setSelectedStudent(student);
    } catch (error) {
      console.error("Student profile error:", error);
      const message = error.response?.data?.message || "Unable to load student profile.";
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  // ==========================================
  // OPEN COLLABORATION REQUEST
  // ==========================================

  const handleOpenRequest = async () => {
    if (!selectedStudent) return;
    setProjectsLoading(true);
    try {
      const data = await getMyProjects();
      const projects = Array.isArray(data) ? data : [];
      setMyProjects(projects);
      setSelectedProjectId("");
      setRequestedRole("MEMBER");
      setRequestMessage("");
      setRequestOpen(true);
    } catch (error) {
      console.error("My projects error:", error);
      const message = error.response?.data?.message || "Unable to load your projects.";
      toast.error(message);
    } finally {
      setProjectsLoading(false);
    }
  };

  // ==========================================
  // CLOSE REQUEST MODAL
  // ==========================================

  const handleCloseRequest = () => {
    if (sendingRequest) return;
    setRequestOpen(false);
    setSelectedProjectId("");
    setRequestedRole("MEMBER");
    setRequestMessage("");
  };

  // ==========================================
  // SEND COLLABORATION REQUEST
  // ==========================================

  const handleSendRequest = async (event) => {
    event.preventDefault();

    if (!selectedStudent) {
      toast.error("Student information is missing.");
      return;
    }
    if (!selectedProjectId) {
      toast.error("Please select one of your projects.");
      return;
    }
    if (!requestedRole) {
      toast.error("Please select a role.");
      return;
    }
    if (!requestMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    if (requestMessage.trim().length > 1000) {
      toast.error("Message cannot exceed 1000 characters.");
      return;
    }

    setSendingRequest(true);
    try {
      await sendCollaborationRequest(
        selectedStudent.id,
        selectedProjectId,
        requestedRole,
        requestMessage
      );
      toast.success("Collaboration request sent successfully!");
      setRequestOpen(false);
      setSelectedProjectId("");
      setRequestedRole("MEMBER");
      setRequestMessage("");
    } catch (error) {
      console.error("Send collaboration request error:", error);
      const message = error.response?.data?.message || "Unable to send collaboration request.";
      toast.error(message);
    } finally {
      setSendingRequest(false);
    }
  };

  // ==========================================
  // FORMAT AVAILABILITY
  // ==========================================

  const formatAvailability = (status) => {
    if (!status) return "Unknown";
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // ==========================================
  // AVAILABILITY STYLE
  // ==========================================

  const getAvailabilityClass = (status) => {
    if (status === "AVAILABLE") return "bg-green-50 border-green-100 text-green-700";
    if (status === "BUSY") return "bg-amber-50 border-amber-100 text-amber-700";
    if (status === "LOOKING_FOR_TEAM") return "bg-blue-50 border-blue-100 text-blue-700";
    return "bg-slate-100 border-slate-200 text-slate-600";
  };

  const getAvailabilityDot = (status) => {
    if (status === "AVAILABLE") return "bg-green-500";
    if (status === "BUSY") return "bg-amber-500";
    if (status === "LOOKING_FOR_TEAM") return "bg-blue-500";
    return "bg-slate-400";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>

      {/* PAGE HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1.5">
            Discover
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find Students
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-lg">
            Discover fellow students and find potential collaborators for your projects.
          </p>
        </div>

        <button
          onClick={loadStudents}
          disabled={loading}
          aria-label="Refresh student list"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <SummaryCard
          title="Total Students"
          value={students.length}
          icon={<Users size={20} />}
          iconBg="bg-blue-50 text-blue-600"
          valueCls="text-blue-700"
        />
        <SummaryCard
          title="Search Results"
          value={filteredStudents.length}
          icon={<Search size={20} />}
          iconBg="bg-slate-100 text-slate-600"
          valueCls="text-slate-900"
        />
      </section>

      {/* SEARCH */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="student-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, roll number, department or specialization"
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* STUDENTS GRID */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Users size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900">Campus Students</h2>
            <p className="text-sm text-slate-500 mt-0.5">Browse students in your campus community.</p>
          </div>
          {filteredStudents.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold shrink-0">
              {filteredStudents.length}
            </span>
          )}
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900">No students found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
              {search ? "Try adjusting your search term." : "No students are available right now."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onView={() => handleViewStudent(student.id)}
                profileLoading={profileLoading}
                formatAvailability={formatAvailability}
                getAvailabilityClass={getAvailabilityClass}
                getAvailabilityDot={getAvailabilityDot}
              />
            ))}
          </div>
        )}
      </section>

      {/* STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSendRequest={handleOpenRequest}
          projectsLoading={projectsLoading}
          formatAvailability={formatAvailability}
          getAvailabilityClass={getAvailabilityClass}
          getAvailabilityDot={getAvailabilityDot}
        />
      )}

      {/* SEND COLLABORATION REQUEST MODAL */}
      {requestOpen && selectedStudent && (
        <CollaborationRequestModal
          student={selectedStudent}
          projects={myProjects}
          projectsLoading={projectsLoading}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          requestedRole={requestedRole}
          setRequestedRole={setRequestedRole}
          message={requestMessage}
          setMessage={setRequestMessage}
          sending={sendingRequest}
          onClose={handleCloseRequest}
          onSubmit={handleSendRequest}
        />
      )}

    </DashboardLayout>
  );
};


// ==========================================
// SUMMARY CARD
// ==========================================

const SummaryCard = ({ title, value, icon, iconBg = "bg-blue-50 text-blue-600", valueCls = "text-slate-900" }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-bold mt-2 ${valueCls}`}>{value}</p>
      </div>
      <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
    </div>
  </div>
);


// ==========================================
// STUDENT CARD
// ==========================================

const StudentCard = ({
  student,
  onView,
  profileLoading,
  formatAvailability,
  getAvailabilityClass,
  getAvailabilityDot,
}) => {
  const initials = student.fullName
    ? student.fullName.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col">

      <div className="flex items-start gap-3.5">
        <div className="w-13 h-13 min-w-[52px] min-h-[52px] w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-lg font-bold shrink-0 select-none">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 break-words leading-snug">
            {student.fullName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {student.rollNumber}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {student.department && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <GraduationCap size={15} className="text-slate-400 shrink-0" />
            <span className="truncate">
              {student.department}
              {student.year ? ` · Year ${student.year}` : ""}
            </span>
          </div>
        )}

        {student.branch && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={15} className="text-slate-400 shrink-0" />
            <span className="truncate">{student.branch}</span>
          </div>
        )}

        {student.email && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail size={15} className="text-slate-400 shrink-0" />
            <span className="truncate text-xs">{student.email}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getAvailabilityClass(student.availabilityStatus)}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getAvailabilityDot(student.availabilityStatus)}`} />
          {formatAvailability(student.availabilityStatus)}
        </span>
      </div>

      <button
        onClick={onView}
        disabled={profileLoading}
        className="mt-auto pt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        <Eye size={16} />
        {profileLoading ? "Loading..." : "View Profile"}
      </button>
    </div>
  );
};


// ==========================================
// STUDENT PROFILE MODAL
// ==========================================

const StudentProfileModal = ({
  student,
  onClose,
  onSendRequest,
  projectsLoading,
  formatAvailability,
  getAvailabilityClass,
  getAvailabilityDot,
}) => {
  const initials = student.fullName
    ? student.fullName.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-100">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Student Profile</p>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{student.fullName}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close student profile"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          {/* IDENTITY */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-3xl font-bold shrink-0 select-none">
              {initials}
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900">{student.fullName}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{student.rollNumber}</p>
              <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold border ${getAvailabilityClass(student.availabilityStatus)}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getAvailabilityDot(student.availabilityStatus)}`} />
                {formatAvailability(student.availabilityStatus)}
              </span>
            </div>
          </div>

          {/* BIO */}
          {student.bio && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">About</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{student.bio}</p>
            </div>
          )}

          {/* SKILLS */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills?.length ? (
                student.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills added yet</span>
              )}
            </div>
          </div>

          {/* INFORMATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <ProfileItem label="Email" value={student.email} icon={<Mail size={15} />} />
            <ProfileItem label="Department" value={student.department} icon={<GraduationCap size={15} />} />
            <ProfileItem label="Year" value={student.year} icon={<User size={15} />} />
            <ProfileItem label="Specialization" value={student.branch} icon={<MapPin size={15} />} />
          </div>

          {/* CAREER LINKS */}
          {(student.githubUrl || student.linkedinUrl) && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Career Links</h3>
              <div className="flex flex-wrap gap-3">
                {student.githubUrl && (
                  <a
                    href={student.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                  >
                    <ExternalLink size={15} />
                    GitHub
                  </a>
                )}
                {student.linkedinUrl && (
                  <a
                    href={student.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    <ExternalLink size={15} />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}

          {/* SEND REQUEST */}
          <div className="mt-7 pt-6 border-t border-slate-200">
            <button
              onClick={onSendRequest}
              disabled={projectsLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send size={17} />
              {projectsLoading ? "Loading your projects..." : "Send Collaboration Request"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};


// ==========================================
// COLLABORATION REQUEST MODAL
// ==========================================

const CollaborationRequestModal = ({
  student,
  projects,
  projectsLoading,
  selectedProjectId,
  setSelectedProjectId,
  requestedRole,
  setRequestedRole,
  message,
  setMessage,
  sending,
  onClose,
  onSubmit,
}) => {
  return (
    <div
      className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Collaboration</p>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">Send Request</h2>
            <p className="text-sm text-slate-500 mt-1">
              Invite {student.fullName} to collaborate with you.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={sending}
            aria-label="Close collaboration request modal"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">

          {/* SELECT PROJECT */}
          <div>
            <label htmlFor="collab-project" className="block text-sm font-semibold text-slate-700 mb-2">
              Select Your Project
            </label>

            {projectsLoading ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 text-sm text-slate-500">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Loading your projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <FolderKanban size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">You don&apos;t have any projects.</p>
                    <p className="text-xs text-amber-700 mt-1">Add a project first before sending a collaboration request.</p>
                  </div>
                </div>
              </div>
            ) : (
              <select
                id="collab-project"
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                disabled={sending}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectTitle}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* SELECT ROLE */}
          <div>
            <label htmlFor="requestedRole" className="block text-sm font-semibold text-slate-700 mb-2">
              Select Role
            </label>
            <select
              id="requestedRole"
              value={requestedRole}
              onChange={(event) => setRequestedRole(event.target.value)}
              disabled={sending}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 transition"
            >
              <option value="MEMBER">Member</option>
              <option value="BACKEND_DEVELOPER">Backend Developer</option>
              <option value="FRONTEND_DEVELOPER">Frontend Developer</option>
              <option value="AI_ENGINEER">AI Engineer</option>
              <option value="DATABASE_ENGINEER">Database Engineer</option>
              <option value="TESTER">Tester</option>
            </select>
          </div>

          {/* MESSAGE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="collab-message" className="block text-sm font-semibold text-slate-700">
                Message <span className="text-red-500 ml-0.5">*</span>
              </label>
              <span className="text-xs text-slate-400">{message.length}/1000</span>
            </div>
            <textarea
              id="collab-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={sending}
              maxLength={1000}
              rows={5}
              placeholder="Introduce yourself and explain why you'd like to collaborate..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 placeholder:text-slate-400 transition"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={sending || projects.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Request
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
// PROFILE ITEM
// ==========================================

const ProfileItem = ({ label, value, icon }) => (
  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-900 break-words">
      {value || "Not provided"}
    </p>
  </div>
);

export default Students;
