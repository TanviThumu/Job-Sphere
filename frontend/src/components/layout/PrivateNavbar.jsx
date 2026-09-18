import { NavLink, Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, UserCircle } from "lucide-react";

export default function PrivateNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* JobSphere Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2"
        >
          <BriefcaseBusiness
            size={28}
            strokeWidth={2}
            className="text-blue-600"
          />

          <span className="text-xl font-bold text-slate-900">
            JobSphere
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={navLinkClass}
          >
            Dashboard
          </NavLink>

          {/* Results */}
          <NavLink
            to="/results"
            className={navLinkClass}
          >
            Results
          </NavLink>

          {/* Apply for Jobs */}
          <NavLink
            to="/apply-jobs"
            className={navLinkClass}
          >
            Apply for Jobs
          </NavLink>

          {/* Profile + User Name */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            <UserCircle size={21} />

            <span>
              {user?.name || "User"}
            </span>
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}