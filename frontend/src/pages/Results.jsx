import { useEffect, useState } from "react";

import PrivateNavbar from "../components/layout/PrivateNavbar";
import ResumeSummary from "../components/results/ResumeSummary";
import Footer from "../components/layout/Footer";

export default function Results() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/resume/my-resume",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // JWT expired or invalid
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load resume.");
          return;
        }

        setResume(data.resume);
      } catch (error) {
        console.error("Resume Fetch Error:", error);

        setError(
          "Unable to connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <PrivateNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Resume Results
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Review your resume analysis and profile.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Loading your resume...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-xl p-6">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Resume */}
        {!loading && !error && resume && (
          <ResumeSummary resume={resume} />
        )}

        <Footer />

      </main>

    </div>
  );
}