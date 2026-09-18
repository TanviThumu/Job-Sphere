import JobItem from "./JobItem";

export default function JobList({
  jobs,
  selectedJob,
  onSelect,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3">

      <h2 className="text-sm font-semibold mb-3">
        Top Job Matches
      </h2>

      <div className="space-y-2">

        {jobs.map((job) => (

          <JobItem
            key={job.id}
            job={job}
            selected={selectedJob?.id === job.id}
            onClick={() => onSelect(job)}
          />

        ))}

      </div>

    </div>
  );
}