import { useState } from "react";

import {
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


const Header = ({
  onMenuClick,
  notificationCount = 0,
}) => {

  const navigate = useNavigate();

  const {
    student,
    logout,
  } = useAuth();

  const [accountOpen, setAccountOpen] =
    useState(false);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    logout();

    setAccountOpen(false);

    navigate("/login", {
      replace: true,
    });

  };


  // ==========================================
  // PROFILE
  // ==========================================

  const handleProfile = () => {

    setAccountOpen(false);

    navigate("/profile");

  };


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const handleNotifications = () => {

    navigate("/notifications");

  };


  return (

    <header className="h-16 bg-white border-b border-slate-200">

      <div
        className="
          h-full
          px-4
          sm:px-6
          lg:px-8
          flex
          items-center
          justify-between
        "
      >

        {/* ==========================================
            MOBILE MENU
        ========================================== */}

        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            p-2
            rounded-lg
            hover:bg-slate-100
            transition
          "
        >

          <Menu size={22} />

        </button>


        {/* ==========================================
            DESKTOP TITLE
        ========================================== */}

        <div className="hidden lg:block">

          <p className="text-sm text-slate-500">
            Student Dashboard
          </p>

          <h2 className="text-lg font-bold text-slate-900">
            Overview
          </h2>

        </div>


        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="ml-auto flex items-center gap-4">


          {/* ==========================================
              NOTIFICATION BUTTON
          ========================================== */}

          <button
            onClick={handleNotifications}
            className="
              relative
              p-2.5
              rounded-xl
              hover:bg-slate-100
              transition
            "
          >

            <Bell
              size={21}
              className="text-slate-600"
            />


            {/* Unread notification badge */}

            {notificationCount > 0 && (

              <span
                className="
                  absolute
                  -top-0.5
                  -right-0.5
                  min-w-5
                  h-5
                  px-1
                  bg-red-500
                  text-white
                  text-[10px]
                  font-bold
                  rounded-full
                  border-2
                  border-white
                  flex
                  items-center
                  justify-center
                "
              >

                {notificationCount > 99
                  ? "99+"
                  : notificationCount}

              </span>

            )}

          </button>


          {/* ==========================================
              ACCOUNT AREA
          ========================================== */}

          <div className="relative">

            <button
              onClick={() =>
                setAccountOpen(
                  (previous) => !previous
                )
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                px-2
                py-1.5
                hover:bg-slate-50
                transition
              "
            >

              {/* Student Name */}

              <div className="hidden sm:block text-right">

                <p className="text-sm font-semibold text-slate-900">

                  {student?.fullName ||
                    "Student"}

                </p>

                <p className="text-xs text-slate-500">

                  Student

                </p>

              </div>


              {/* Avatar */}

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >

                {student?.fullName
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}

              </div>


              {/* Dropdown Arrow */}

              <ChevronDown
                size={16}
                className={`
                  hidden
                  sm:block
                  text-slate-500
                  transition-transform
                  ${
                    accountOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {/* ==========================================
                ACCOUNT DROPDOWN
            ========================================== */}

            {accountOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-56
                  bg-white
                  rounded-xl
                  border
                  border-slate-200
                  shadow-lg
                  z-50
                  overflow-hidden
                "
              >

                {/* Account Information */}

                <div
                  className="
                    px-4
                    py-3
                    border-b
                    border-slate-100
                  "
                >

                  <p className="text-sm font-semibold text-slate-900">

                    {student?.fullName ||
                      "Student"}

                  </p>

                  <p className="text-xs text-slate-500 mt-1 truncate">

                    {student?.email || ""}

                  </p>

                </div>


                {/* Profile */}

                <button
                  onClick={handleProfile}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-slate-700
                    hover:bg-slate-50
                    transition
                  "
                >

                  <User
                    size={17}
                    className="text-slate-500"
                  />

                  <span>
                    My Profile
                  </span>

                </button>


                {/* Logout */}

                <button
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-red-600
                    hover:bg-red-50
                    transition
                    border-t
                    border-slate-100
                  "
                >

                  <LogOut size={17} />

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>

  );

};

export default Header;