import { Link } from "react-router-dom";
import { BriefcaseBusiness, CircleUserRound, LogOut } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-bold text-slate-900"
        >
          <BriefcaseBusiness
            className="text-blue-600"
            size={24}
          />
          JobSphere
        </Link>

        <div className="flex items-center gap-6">

          <button className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition">
            <CircleUserRound size={20} />
            <span className="text-sm font-medium">
              Profile
            </span>
          </button>

          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition">
            <LogOut size={20} />
            <span className="text-sm font-medium">
              Logout
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}

export default DashboardHeader;