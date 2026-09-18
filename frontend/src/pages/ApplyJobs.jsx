import { useState } from "react";

import PrivateNavbar from "../components/layout/PrivateNavbar";
import Footer from "../components/layout/Footer";

export default function ApplyJobs() {
  const [filters, setFilters] = useState({
    type: "Any",
    experience: "Fresher",
    location: "",
    workMode: "Any",
    jobCount: 5,
  });

  const [jobs, setJobs] = useState([]);
  const [targetRoles, setTargetRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/jobs/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(filters),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to find recommended jobs."
        );

        setJobs([]);
        return;
      }

      setJobs(data.recommendations?.jobs || []);
      setTargetRoles(
        data.recommendations?.targetRoles || []
      );
    } catch (error) {
      console.error(
        "Job Recommendation Error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PrivateNavbar />

      <main className="max-w-7xl mx-auto px-6 py-6">

        {/* Page Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">
            Apply for Jobs
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Find job opportunities that match your profile.
          </p>
        </div>


        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Opportunity Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Opportunity Type
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  "Internship",
                  "Full-time",
                  "Part-time",
                  "Any",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      handleChange("type", type)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                      filters.type === type
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>


            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Experience Level
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  "Fresher",
                  "0–1 years",
                  "1–3 years",
                  "3–5 years",
                  "5+ years",
                ].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      handleChange(
                        "experience",
                        level
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                      filters.experience === level
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>


            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Location
              </label>

              <select
                id="location"
                value={filters.location}
                onChange={(e) =>
                  handleChange(
                    "location",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option value="">
                  Select a location
                </option>

                <option value="Hyderabad">
                  Hyderabad
                </option>

                <option value="Bengaluru">
                  Bengaluru
                </option>

                <option value="Chennai">
                  Chennai
                </option>

                <option value="Mumbai">
                  Mumbai
                </option>

                <option value="Pune">
                  Pune
                </option>

                <option value="Delhi">
                  Delhi
                </option>

                <option value="Noida">
                  Noida
                </option>

                <option value="Gurugram">
                  Gurugram
                </option>

                <option value="Kolkata">
                  Kolkata
                </option>

                <option value="Ahmedabad">
                  Ahmedabad
                </option>
              </select>
            </div>
          </div>


          {/* Work Mode + Job Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            {/* Work Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Work Mode
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  "Any",
                  "Remote",
                  "Hybrid",
                  "On-site",
                ].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      handleChange(
                        "workMode",
                        mode
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                      filters.workMode === mode
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>


            {/* Job Count */}
            <div>
              <label
                htmlFor="jobCount"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Number of Jobs
              </label>

              <select
                id="jobCount"
                value={filters.jobCount}
                onChange={(e) =>
                  handleChange(
                    "jobCount",
                    Number(e.target.value)
                  )
                }
                className="w-full md:w-48 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={15}>Top 15</option>
                <option value={20}>Top 20</option>
              </select>
            </div>
          </div>


          {/* Search Button */}
          <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Finding Jobs..."
                : "Find Jobs"}
            </button>

          </div>
        </div>


        {/* Error */}
        {error && (
          <div className="mt-5 bg-white border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}


        {/* Target Roles */}
        {!loading &&
          !error &&
          targetRoles.length > 0 && (
            <div className="mt-5 bg-white border border-slate-200 rounded-xl p-5">

              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Recommended Roles
              </h2>

              <div className="flex flex-wrap gap-2">
                {targetRoles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>

            </div>
          )}


        {/* Loading */}
        {loading && (
          <div className="mt-5 bg-white border border-slate-200 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-500">
              Finding jobs that match your resume...
            </p>
          </div>
        )}


        {/* No Jobs */}
        {!loading &&
          !error &&
          searched &&
          jobs.length === 0 && (
            <div className="mt-5 bg-white border border-slate-200 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-500">
                No matching jobs were found for the selected filters.
              </p>
            </div>
          )}


        {/* Jobs */}
        {!loading &&
          !error &&
          jobs.length > 0 && (
            <div className="mt-5">

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recommended Jobs
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Ranked based on your resume skills.
                  </p>
                </div>

                <span className="text-xs text-slate-500">
                  {jobs.length} jobs
                </span>

              </div>


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >

                    {/* Job Header */}
                    <div className="flex justify-between gap-4">

                      <div>

                        <h3 className="text-base font-semibold text-slate-900">
                          {job.title}
                        </h3>

                        <p className="text-sm text-slate-600 mt-1">
                          {job.company}
                        </p>

                        {/* Job Source */}
                        {job.source && (
                          <span className="inline-flex mt-2 px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                            Source: {job.source}
                          </span>
                        )}

                      </div>


                      {/* Match */}
                      <div className="shrink-0">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            job.matchPercentage >= 75
                              ? "bg-green-100 text-green-700"
                              : job.matchPercentage >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {job.matchPercentage}% Match
                        </span>

                      </div>

                    </div>


                    {/* Job Information */}
                    <div className="flex flex-wrap gap-2 mt-3">

                      {job.location && (
                        <span className="text-xs text-slate-500">
                          📍 {job.location}
                        </span>
                      )}

                      {job.contractTime && (
                        <span className="text-xs text-slate-500">
                          • {job.contractTime}
                        </span>
                      )}

                      {job.contractType && (
                        <span className="text-xs text-slate-500">
                          • {job.contractType}
                        </span>
                      )}

                    </div>


                    {/* Salary */}
                    {(job.salaryMin ||
                      job.salaryMax) && (
                      <p className="text-xs text-slate-600 mt-3">
                        Salary:{" "}
                        {job.salaryMin
                          ? `₹${Math.round(
                              job.salaryMin
                            ).toLocaleString()}`
                          : ""}

                        {job.salaryMin &&
                        job.salaryMax
                          ? " - "
                          : ""}

                        {job.salaryMax
                          ? `₹${Math.round(
                              job.salaryMax
                            ).toLocaleString()}`
                          : ""}
                      </p>
                    )}


                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-3 line-clamp-3">
                      {job.description}
                    </p>


                    {/* Apply */}
                    <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">

                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
                      >
                        Apply
                      </a>

                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

      </main>

      <Footer />
    </div>
  );
}