import { useEffect, useState } from "react";

import {
  Search,
  Users,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Eye,
  RefreshCw,
  X,
  Send,
  FolderKanban,
  CheckCircle,
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

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  // ==========================================
  // COLLABORATION REQUEST
  // ==========================================

  const [requestOpen, setRequestOpen] =
    useState(false);

  const [myProjects, setMyProjects] =
    useState([]);

  const [projectsLoading, setProjectsLoading] =
    useState(false);

  const [selectedProjectId, setSelectedProjectId] =
    useState("");

  const [requestMessage, setRequestMessage] =
    useState("");

  const [sendingRequest, setSendingRequest] =
    useState(false);

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const data = await getAllStudents();

      setStudents(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Students error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to load students.";

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

  const filteredStudents =
    students.filter((student) => {

      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        student.fullName
          ?.toLowerCase()
          .includes(searchText) ||

        student.rollNumber
          ?.toLowerCase()
          .includes(searchText) ||

        student.department
          ?.toLowerCase()
          .includes(searchText) ||

        student.branch
          ?.toLowerCase()
          .includes(searchText) ||

        student.email
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  // ==========================================
  // VIEW STUDENT
  // ==========================================

  const handleViewStudent = async (id) => {

    try {

      setProfileLoading(true);

      const student =
        await getStudentById(id);

      setSelectedStudent(student);

    } catch (error) {

      console.error(
        "Student profile error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to load student profile.";

      toast.error(message);

    } finally {

      setProfileLoading(false);

    }
  };

  // ==========================================
  // OPEN COLLABORATION REQUEST
  // ==========================================

  const handleOpenRequest = async () => {

    if (!selectedStudent) {
      return;
    }

    setProjectsLoading(true);

    try {

      const data =
        await getMyProjects();

      const projects =
        Array.isArray(data)
          ? data
          : [];

      setMyProjects(projects);

      setSelectedProjectId("");

      setRequestMessage("");

      setRequestOpen(true);

    } catch (error) {

      console.error(
        "My projects error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to load your projects.";

      toast.error(message);

    } finally {

      setProjectsLoading(false);

    }
  };

  // ==========================================
  // CLOSE REQUEST MODAL
  // ==========================================

  const handleCloseRequest = () => {

    if (sendingRequest) {
      return;
    }

    setRequestOpen(false);

    setSelectedProjectId("");

    setRequestMessage("");

  };

  // ==========================================
  // SEND COLLABORATION REQUEST
  // ==========================================

  const handleSendRequest = async (event) => {

    event.preventDefault();

    if (!selectedStudent) {
      toast.error(
        "Student information is missing."
      );

      return;
    }

    if (!selectedProjectId) {
      toast.error(
        "Please select one of your projects."
      );

      return;
    }

    if (!requestMessage.trim()) {
      toast.error(
        "Please enter a message."
      );

      return;
    }

    if (requestMessage.trim().length > 1000) {
      toast.error(
        "Message cannot exceed 1000 characters."
      );

      return;
    }

    setSendingRequest(true);

    try {

      await sendCollaborationRequest(
        selectedStudent.id,
        selectedProjectId,
        requestMessage
      );

      toast.success(
        "Collaboration request sent successfully!"
      );

      setRequestOpen(false);

      setSelectedProjectId("");

      setRequestMessage("");

    } catch (error) {

      console.error(
        "Send collaboration request error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to send collaboration request.";

      toast.error(message);

    } finally {

      setSendingRequest(false);

    }
  };

  // ==========================================
  // FORMAT AVAILABILITY
  // ==========================================

  const formatAvailability = (status) => {

    if (!status) {
      return "Unknown";
    }

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ==========================================
  // AVAILABILITY STYLE
  // ==========================================

  const getAvailabilityClass = (status) => {

    if (status === "AVAILABLE") {
      return "bg-green-50 text-green-700";
    }

    if (status === "BUSY") {
      return "bg-amber-50 text-amber-700";
    }

    if (status === "LOOKING_FOR_TEAM") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          bg-slate-50
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              w-10 h-10
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
            Loading students...
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
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
          mb-8
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
              text-blue-600
              mb-1
            "
          >
            Campus Community
          </p>

          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Find Students
          </h1>

          <p className="mt-2 text-slate-500">
            Discover fellow students and find
            potential project collaborators.
          </p>

        </div>

        <button
          onClick={loadStudents}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            border
            border-slate-300
            bg-white
            text-slate-700
            text-sm
            font-semibold
            hover:bg-slate-50
            transition
            disabled:opacity-50
          "
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </section>

      {/* ==========================================
          SUMMARY
      ========================================== */}

      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
          mb-6
        "
      >

        <SummaryCard
          title="Students Available"
          value={students.length}
          icon={<Users size={21} />}
        />

        <SummaryCard
          title="Search Results"
          value={filteredStudents.length}
          icon={<Search size={21} />}
        />

      </section>

      {/* ==========================================
          SEARCH
      ========================================== */}

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-5
          mb-6
        "
      >

        <div className="relative">

          <Search
            size={19}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, roll number, department or specialization..."
            className="
              w-full
              pl-11
              pr-10
              py-3
              rounded-xl
              border
              border-slate-300
              text-sm
              text-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          {search && (

            <button
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                p-1.5
                rounded-lg
                text-slate-400
                hover:bg-slate-100
              "
            >

              <X size={17} />

            </button>

          )}

        </div>

      </section>

      {/* ==========================================
          STUDENTS
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
            items-center
            gap-3
            mb-6
          "
        >

          <div
            className="
              p-3
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Users size={21} />
          </div>

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              Students
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Browse students in your campus
              community.
            </p>

          </div>

        </div>

        {filteredStudents.length === 0 ? (

          <div
            className="
              py-14
              text-center
              border
              border-dashed
              border-slate-200
              rounded-2xl
            "
          >

            <div
              className="
                w-16 h-16
                rounded-2xl
                bg-slate-50
                text-slate-400
                flex
                items-center
                justify-center
                mx-auto
                mb-4
              "
            >
              <Users size={30} />
            </div>

            <h3
              className="
                text-base
                font-bold
                text-slate-900
              "
            >
              No students found
            </h3>

            <p
              className="
                text-sm
                text-slate-500
                mt-2
              "
            >
              Try a different search term.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
            "
          >

            {filteredStudents.map(
              (student) => (

                <StudentCard
                  key={student.id}
                  student={student}
                  onView={() =>
                    handleViewStudent(
                      student.id
                    )
                  }
                  profileLoading={
                    profileLoading
                  }
                  formatAvailability={
                    formatAvailability
                  }
                  getAvailabilityClass={
                    getAvailabilityClass
                  }
                />

              )
            )}

          </div>

        )}

      </section>

      {/* ==========================================
          STUDENT PROFILE MODAL
      ========================================== */}

      {selectedStudent && (

        <StudentProfileModal
          student={selectedStudent}
          onClose={() =>
            setSelectedStudent(null)
          }
          onSendRequest={
            handleOpenRequest
          }
          projectsLoading={
            projectsLoading
          }
          formatAvailability={
            formatAvailability
          }
          getAvailabilityClass={
            getAvailabilityClass
          }
        />

      )}

      {/* ==========================================
          SEND COLLABORATION REQUEST MODAL
      ========================================== */}

      {requestOpen && selectedStudent && (

        <CollaborationRequestModal
          student={selectedStudent}
          projects={myProjects}
          projectsLoading={projectsLoading}
          selectedProjectId={
            selectedProjectId
          }
          setSelectedProjectId={
            setSelectedProjectId
          }
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

const SummaryCard = ({
  title,
  value,
  icon,
}) => {

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        p-5
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-slate-900
              mt-2
            "
          >
            {value}
          </p>

        </div>

        <div
          className="
            p-3
            rounded-xl
            bg-blue-50
            text-blue-600
          "
        >
          {icon}
        </div>

      </div>

    </div>
  );
};


// ==========================================
// STUDENT CARD
// ==========================================

const StudentCard = ({
  student,
  onView,
  profileLoading,
  formatAvailability,
  getAvailabilityClass,
}) => {

  return (
    <div
      className="
        border
        border-slate-200
        rounded-2xl
        p-5
        hover:shadow-md
        transition
      "
    >

      <div className="flex items-start gap-4">

        <div
          className="
            w-14 h-14
            rounded-2xl
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            text-xl
            font-bold
            shrink-0
          "
        >
          {student.fullName
            ?.charAt(0)
            ?.toUpperCase()}
        </div>

        <div className="min-w-0">

          <h3
            className="
              text-base
              font-bold
              text-slate-900
              break-words
            "
          >
            {student.fullName}
          </h3>

          <p
            className="
              text-xs
              text-slate-400
              mt-1
            "
          >
            {student.rollNumber}
          </p>

        </div>

      </div>

      <div className="mt-5 space-y-3">

        {student.department && (

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
            "
          >

            <GraduationCap
              size={16}
              className="text-slate-400"
            />

            <span>

              {student.department}

              {student.year
                ? ` • Year ${student.year}`
                : ""}

            </span>

          </div>
        )}

        {student.branch && (

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
            "
          >

            <MapPin
              size={16}
              className="text-slate-400"
            />

            <span>
              {student.branch}
            </span>

          </div>
        )}

        {student.email && (

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >

            <Mail
              size={16}
              className="text-slate-400"
            />

            <span className="truncate">
              {student.email}
            </span>

          </div>
        )}

      </div>

      <div className="mt-5">

        <span
          className={`
            inline-flex
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            ${getAvailabilityClass(
              student.availabilityStatus
            )}
          `}
        >

          ●{" "}

          {formatAvailability(
            student.availabilityStatus
          )}

        </span>

      </div>

      <button
        onClick={onView}
        disabled={profileLoading}
        className="
          mt-5
          w-full
          inline-flex
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
          transition
          disabled:opacity-50
        "
      >

        <Eye size={16} />

        {profileLoading
          ? "Loading..."
          : "View Profile"}

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
}) => {

  return (
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
          onClose();
        }

      }}
    >

      <div
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          bg-white
          rounded-2xl
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-10
            bg-white
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

            <p
              className="
                text-sm
                text-blue-600
                font-medium
              "
            >
              Student Profile
            </p>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              {student.fullName}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-lg
              text-slate-500
              hover:bg-slate-100
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* CONTENT */}

        <div className="p-6">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-start
              gap-5
            "
          >

            <div
              className="
                w-20 h-20
                rounded-2xl
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                text-3xl
                font-bold
                shrink-0
              "
            >
              {student.fullName
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div className="flex-1">

              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                {student.fullName}
              </h3>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                {student.rollNumber}
              </p>

              <span
                className={`
                  inline-flex
                  mt-3
                  px-3
                  py-1.5
                  rounded-full
                  text-xs
                  font-semibold
                  ${getAvailabilityClass(
                    student.availabilityStatus
                  )}
                `}
              >
                {formatAvailability(
                  student.availabilityStatus
                )}
              </span>

            </div>

          </div>

          {/* ABOUT */}

          {student.bio && (

            <div className="mt-6">

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                  mb-2
                "
              >
                About
              </h3>

              <p
                className="
                  text-sm
                  text-slate-600
                  leading-relaxed
                "
              >
                {student.bio}
              </p>

            </div>

          )}

          {/* INFORMATION */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              mt-6
            "
          >

            <ProfileItem
              label="Email"
              value={student.email}
              icon={<Mail size={16} />}
            />

            <ProfileItem
              label="Phone"
              value={student.phoneNumber}
              icon={<Phone size={16} />}
            />

            <ProfileItem
              label="Department"
              value={student.department}
              icon={<GraduationCap size={16} />}
            />

            <ProfileItem
              label="Year"
              value={student.year}
              icon={<User size={16} />}
            />

            <ProfileItem
              label="Specialization"
              value={student.branch}
              icon={<MapPin size={16} />}
            />

          </div>

          {/* LINKS */}

          {(student.githubUrl ||
            student.linkedinUrl) && (

            <div className="mt-6">

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                  mb-3
                "
              >
                Career Links
              </h3>

              <div
                className="
                  flex
                  flex-wrap
                  gap-3
                "
              >

                {student.githubUrl && (

                  <a
                    href={student.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      bg-slate-900
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-slate-800
                    "
                  >

                    <span className="font-bold text-sm">
                      GH
                    </span>

                    GitHub

                  </a>

                )}

                {student.linkedinUrl && (

                  <a
                    href={student.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      bg-blue-600
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-blue-700
                    "
                  >

                    <span className="font-bold text-sm">
                      in
                    </span>

                    LinkedIn

                  </a>

                )}

              </div>

            </div>

          )}

          {/* ======================================
              SEND COLLABORATION BUTTON
          ====================================== */}

          <div
            className="
              mt-7
              pt-6
              border-t
              border-slate-200
            "
          >

            <button
              onClick={onSendRequest}
              disabled={projectsLoading}
              className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-blue-600
                text-white
                text-sm
                font-semibold
                hover:bg-blue-700
                transition
                disabled:opacity-50
              "
            >

              <Send size={17} />

              {projectsLoading
                ? "Loading your projects..."
                : "Send Collaboration Request"}

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
  message,
  setMessage,
  sending,
  onClose,
  onSubmit,
}) => {

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        bg-black/60
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
          onClose();
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

        {/* HEADER */}

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

            <p
              className="
                text-sm
                text-blue-600
                font-medium
              "
            >
              Collaboration
            </p>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Send Request
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Invite {student.fullName} to
              collaborate with you.
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={sending}
            className="
              p-2
              rounded-lg
              text-slate-500
              hover:bg-slate-100
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="p-6 space-y-5"
        >

          {/* SELECT PROJECT */}

          <div>

            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Select Your Project
            </label>

            {projectsLoading ? (

              <div
                className="
                  flex
                  items-center
                  gap-3
                  p-4
                  rounded-xl
                  bg-slate-50
                  text-sm
                  text-slate-500
                "
              >

                <div
                  className="
                    w-5 h-5
                    border-2
                    border-blue-600
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                />

                Loading your projects...

              </div>

            ) : projects.length === 0 ? (

              <div
                className="
                  p-4
                  rounded-xl
                  bg-amber-50
                  border
                  border-amber-200
                "
              >

                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >

                  <FolderKanban
                    size={20}
                    className="
                      text-amber-600
                      shrink-0
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-amber-800
                      "
                    >
                      You don't have any projects.
                    </p>

                    <p
                      className="
                        text-xs
                        text-amber-700
                        mt-1
                      "
                    >
                      Add a project first before
                      sending a collaboration request.
                    </p>

                  </div>

                </div>

              </div>

            ) : (

              <select
                value={selectedProjectId}
                onChange={(event) =>
                  setSelectedProjectId(
                    event.target.value
                  )
                }
                disabled={sending}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  text-sm
                  text-slate-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  disabled:opacity-60
                "
              >

                <option value="">
                  -- Select a project --
                </option>

                {projects.map((project) => (

                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.projectTitle}
                  </option>

                ))}

              </select>

            )}

          </div>

          {/* MESSAGE */}

          <div>

            <div
              className="
                flex
                items-center
                justify-between
                mb-2
              "
            >

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Message
              </label>

              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                {message.length}/1000
              </span>

            </div>

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              disabled={sending}
              maxLength={1000}
              rows={5}
              placeholder="Hi! I'd like to collaborate with you on this project..."
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-slate-300
                text-sm
                text-slate-700
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                disabled:opacity-60
              "
            />

          </div>

          {/* BUTTONS */}

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
              onClick={onClose}
              disabled={sending}
              className="
                px-5
                py-2.5
                rounded-xl
                border
                border-slate-300
                text-slate-700
                text-sm
                font-semibold
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                sending ||
                projects.length === 0
              }
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-xl
                bg-blue-600
                text-white
                text-sm
                font-semibold
                hover:bg-blue-700
                disabled:opacity-50
              "
            >

              {sending ? (

                <>
                  <div
                    className="
                      w-4 h-4
                      border-2
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                  />

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

const ProfileItem = ({
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
          break-words
        "
      >
        {value || "Not provided"}
      </p>

    </div>
  );
};

export default Students;