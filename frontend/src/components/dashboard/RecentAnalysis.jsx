import { FileText } from "lucide-react";

function RecentAnalysis() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full">

      <h2 className="text-lg font-semibold text-slate-900">
        Recent Analysis
      </h2>

      <div className="flex flex-col items-center justify-center h-72 text-center">

        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
          <FileText
            size={28}
            className="text-slate-500"
          />
        </div>

        <h3 className="mt-5 text-base font-medium text-slate-800">
          No resume analysed yet
        </h3>

        <p className="mt-2 text-sm text-slate-500 max-w-xs">
          Upload a resume to view ATS score, salary prediction,
          skills analysis and job recommendations.
        </p>

      </div>

    </div>
  );
}

export default RecentAnalysis;