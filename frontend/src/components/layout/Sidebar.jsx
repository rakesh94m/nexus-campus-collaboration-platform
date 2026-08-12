import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UserSearch,
  BrainCircuit,
} from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
}) => {

  return (
    <>
      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/30
            lg:hidden
          "
          onClick={onClose}
        />
      )}


      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-full
          w-64
          bg-white
          border-r
          border-slate-200
          transform
          transition-transform
          duration-200
          ease-in-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* ==========================================
            LOGO
        ========================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            h-16
            px-6
            border-b
            border-slate-200
          "
        >

          <span
            className="
              text-xl
              font-bold
              text-blue-600
            "
          >
            NEXUS
          </span>

        </div>


        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="p-4 space-y-1">


          {/* ==========================================
              DASHBOARD
          ========================================== */}

          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                px-4
                py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-colors

                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `
            }
          >

            <LayoutDashboard size={18} />

            <span>
              Dashboard
            </span>

          </NavLink>


          {/* ==========================================
              PROJECTS
          ========================================== */}

          <NavLink
            to="/projects"
            onClick={onClose}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                px-4
                py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-colors

                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `
            }
          >

            <FolderKanban size={18} />

            <span>
              Projects
            </span>

          </NavLink>


          {/* ==========================================
              CAREER ROADMAP
          ========================================== */}

          <NavLink
            to="/career-roadmap"
            onClick={onClose}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                px-4
                py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-colors

                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `
            }
          >

            <BrainCircuit size={18} />

            <span>
              Career Roadmap
            </span>

          </NavLink>


          {/* ==========================================
              COLLABORATION
          ========================================== */}

          <NavLink
            to="/collaboration"
            onClick={onClose}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                px-4
                py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-colors

                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `
            }
          >

            <Users size={18} />

            <span>
              Collaboration
            </span>

          </NavLink>


          {/* ==========================================
              FIND STUDENTS
          ========================================== */}

          <NavLink
            to="/students"
            onClick={onClose}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                px-4
                py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-colors

                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `
            }
          >

            <UserSearch size={18} />

            <span>
              Find Students
            </span>

          </NavLink>


        </nav>

      </aside>
    </>
  );
};

export default Sidebar;