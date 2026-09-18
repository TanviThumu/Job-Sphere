
import MatchBadge from "./MatchBadge";
import { MapPin, IndianRupee } from "lucide-react";

export default function JobDetails({ job }) {

  if (!job) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 h-full flex items-center justify-center text-slate-500 text-sm">
        Select a job to view details.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-lg font-semibold">{job.company}</h2>

          <p className="text-sm text-slate-500 mt-1">
            {job.role}
          </p>

          <div className="flex gap-4 mt-3 text-xs text-slate-500">

            <div className="flex items-center gap-1">
              <MapPin size={14}/>
              {job.location}
            </div>

            <div className="flex items-center gap-1">
              
              {job.salary}
            </div>

          </div>

        </div>

        <MatchBadge score={job.atsScore}/>
      </div>

      <div className="mt-4">
            <span className="text-2xl font-bold text-green-600">
                {job.atsScore}%
            </span>

            <p className="text-sm text-slate-500">
                ATS Match
            </p>
       </div>

      {/* Skills */}

      <div className="grid grid-cols-2 gap-6 mt-6">

        <div>

          <h3 className="text-sm font-semibold mb-2">
            Matched Skills
          </h3>

          <div className="space-y-1">

            {job.matchedSkills.map(skill => (
              <p key={skill} className="text-xs text-emerald-600">
                ✓ {skill}
              </p>
            ))}

          </div>

        </div>

        <div>

          <h3 className="text-sm font-semibold mb-2">
            Missing Skills
          </h3>

          <div className="space-y-1">

            {job.missingSkills.map(skill => (
              <p key={skill} className="text-xs text-rose-600">
                ✕ {skill}
              </p>
            ))}

          </div>

        </div>

      </div>

      {/* AI Suggestion */}

      <div className="mt-6 bg-slate-50 border rounded-lg p-3">

        <p className="text-xs font-semibold text-slate-700">
          AI Recommendation
        </p>

        <p className="text-sm text-slate-600 mt-2">
          {job.suggestion}
        </p>

      </div>

      <button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
      >
        Apply Now
      </button>

    </div>
  );
}