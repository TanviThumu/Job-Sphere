import React from "react";

const JobFilters = ({ filters, setFilters, onSearch }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">
        Find Jobs
      </h2>

      {/* Opportunity Type */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opportunity Type
        </label>

        <div className="flex flex-wrap gap-2">
          {["Internship", "Full-time", "Part-time", "Any"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleChange("type", type)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                filters.type === type
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
              onClick={() => handleChange("experience", level)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                filters.experience === level
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Specific Location */}
      <div className="mb-5">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Location
        </label>

        <select
          id="location"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full md:w-80 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="">Select a location</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Chennai">Chennai</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
          <option value="Delhi">Delhi</option>
          <option value="Noida">Noida</option>
          <option value="Gurugram">Gurugram</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Ahmedabad">Ahmedabad</option>
        </select>
      </div>

      {/* Work Mode */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Work Mode
        </label>

        <div className="flex flex-wrap gap-2">
          {["Any", "Remote", "Hybrid", "On-site"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleChange("workMode", mode)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                filters.workMode === mode
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={onSearch}
        className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
      >
        Find Jobs
      </button>
    </div>
  );
};

export default JobFilters;