import { useState } from "react";
import axios from "axios";
import PrivateNavbar from "../components/layout/PrivateNavbar";
import Footer from "../components/layout/Footer";
import {
  User,
  Mail,
  Lock,
  X,
  CheckCircle,
} from "lucide-react";

export default function Profile() {
  // Get logged-in user information
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Popup state
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [skills] = useState([
    "Python",
    "React",
    "SQL",
    "Node.js",
    "MongoDB",
    "Machine Learning",
  ]);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const closeMessage = () => {
    setMessage("");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    // Check passwords before sending request
    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      showMessage("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showMessage(
          "Your session has expired. Please login again."
        );
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword:
            passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword:
            passwordData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showMessage(
        response.data.message ||
          "Password changed successfully.",
        "success"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);

    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      showMessage(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <PrivateNavbar />

      {/* ================= POPUP ================= */}

      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">

          <div className="relative w-full max-w-xs bg-white rounded-lg shadow-lg border border-slate-200 p-5">

            {/* Close button */}

            <button
              type="button"
              onClick={closeMessage}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition"
            >
              <X size={17} />
            </button>

            {/* Icon */}

            <div className="flex justify-center mb-4">

              {messageType === "success" ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">

                  <CheckCircle
                    size={20}
                    className="text-emerald-600"
                  />

                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">

                  <span className="text-xl font-semibold text-blue-600">
                    !
                  </span>

                </div>
              )}

            </div>

            {/* Message */}

            <p className="text-center text-base font-medium text-slate-600 leading-relaxed px-2">
              {message}
            </p>

            {/* Okay button */}

            <button
              type="button"
              onClick={closeMessage}
              className={`w-full mt-5 py-2.5 rounded-md text-sm font-medium text-white transition ${
                messageType === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Okay
            </button>

          </div>

        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">

        <h1 className="text-2xl font-semibold text-slate-900">
          My Profile
        </h1>

        {/* ================= PERSONAL INFORMATION ================= */}

        <div className="bg-white rounded-xl border border-slate-200 p-5 mt-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-5">
            Personal Information
          </h2>

          <div className="space-y-4">

            {/* Name */}

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2">

                <User
                  size={18}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  Name
                </span>

              </div>

              <span className="text-sm text-slate-600">
                {user.name || "Not available"}
              </span>

            </div>

            {/* Email */}

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2">

                <Mail
                  size={18}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  Email
                </span>

              </div>

              <span className="text-sm text-slate-600">
                {user.email || "Not available"}
              </span>

            </div>

          </div>

        </div>


        {/* ================= ACCOUNT SECURITY ================= */}

        <div className="bg-white rounded-xl border border-slate-200 p-5 mt-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-5">
            Account Security
          </h2>

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-2">

              <Lock
                size={18}
                className="text-blue-600"
              />

              <div>

                <p className="font-medium">
                  Password
                </p>

                <p className="text-sm text-slate-500">
                  Keep your account secure
                </p>

              </div>

            </div>

            <button
              onClick={() => setShowPasswordForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Change Password
            </button>

          </div>

        </div>


        {/* ================= CHANGE PASSWORD FORM ================= */}

        {showPasswordForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 mt-6 shadow-sm">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-lg font-semibold">
                Change Password
              </h2>

              <button
                onClick={() =>
                  setShowPasswordForm(false)
                }
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4"
            >

              {/* Current Password */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />

              </div>


              {/* New Password */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />

              </div>


              {/* Confirm Password */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />

              </div>


              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Update Password
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordForm(false)
                  }
                  className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}


        {/* ================= SKILLS ================= */}

        <div className="bg-white rounded-xl border border-slate-200 p-5 mt-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-4">
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">

            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}