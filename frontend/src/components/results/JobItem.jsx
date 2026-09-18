import MatchBadge from "./MatchBadge";
import { MapPin, IndianRupee, Building2 } from "lucide-react";

export default function JobItem({ job, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-lg border p-3 transition-all
        ${
          selected
            ? "border-blue-500 bg-blue-50"
            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
        }
      `}
    >
      <div className="flex justify-between items-start">

        <div className="flex gap-2">

          <Building2
            size={16}
            className="text-slate-500 mt-0.5"
          />

          <div>

            <h3 className="text-sm font-semibold">
              {job.company}
            </h3>

            <p className="text-xs text-slate-500">
              {job.role}
            </p>

          </div>

        </div>

        <div className="text-right">

          <MatchBadge score={job.atsScore} />

          <p className="text-xs font-semibold mt-1">
            {job.atsScore}%
          </p>

        </div>

      </div>

      <div className="flex gap-4 mt-3 text-xs text-slate-500">

        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {job.location}
        </span>

        <span className="flex items-center gap-1">

          {job.salary}
        </span>

      </div>

    </div>
  );
}