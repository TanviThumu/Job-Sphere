import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  BriefcaseBusiness,
  X,
  CheckCircle,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const closeMessage = () => {
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    // Email validation
    if (!email.trim()) {
      showMessage("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      showMessage("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.message || "Email or password is incorrect."
        );
        return;
      }

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Save token if backend sends one
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      showMessage("Login successful!", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);

      showMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6">

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

      {/* ================= LOGIN CARD ================= */}

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-3">

          <Link
            to="/"
            className="flex items-center gap-1.5 text-lg font-bold text-blue-600"
          >
            <BriefcaseBusiness size={21} />
            JobSphere
          </Link>

        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">

          {/* Heading */}
          <div className="text-center mb-4">

            <h1 className="text-lg font-semibold text-slate-900">
              Welcome back
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Login to continue to JobSphere.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            noValidate
            className="space-y-3"
          >

            {/* Email */}
            <div>

              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-10 px-3 rounded-md border border-slate-300 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />

            </div>

            {/* Password */}
            <div>

              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-10 px-3 pr-10 rounded-md border border-slate-300 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md transition mt-1"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register Link */}
          <p className="text-center text-xs text-slate-500 mt-4">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Create one
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;