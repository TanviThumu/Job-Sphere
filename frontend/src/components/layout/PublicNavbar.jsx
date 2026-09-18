import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";

export default function PublicNavbar() {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <BriefcaseBusiness size={24} />
          JobSphere
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          <Link
            to="/login"
            className="text-slate-600 hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Sign Up
          </Link>

        </div>

      </div>

    </nav>
  );
}