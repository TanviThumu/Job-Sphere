export default function ResumeSummary({ resume }) {
  if (!resume) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-500">
          No resume analysis available.
        </p>
      </div>
    );
  }

  const analysis = resume.analysis;

  if (!analysis) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Resume Summary
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Resume analysis is not available yet.
        </p>
      </div>
    );
  }

  const skills = analysis.skills || {};

  const skillCategories = [
    {
      title: "Programming",
      items: skills.programming || [],
    },
    {
      title: "Data Science",
      items: skills.dataScience || [],
    },
    {
      title: "Machine Learning",
      items: skills.machineLearning || [],
    },
    {
      title: "Deep Learning",
      items: skills.deepLearning || [],
    },
    {
      title: "NLP",
      items: skills.nlp || [],
    },
    {
      title: "Tools",
      items: skills.tools || [],
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">

      {/* =========================
          HEADER
      ========================= */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Resume Summary
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          {resume.fileName}
        </p>
      </div>


      {/* =========================
          PROFILE SUMMARY
      ========================= */}
      {analysis.summary && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Profile Summary
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed">
            {analysis.summary}
          </p>
        </section>
      )}


      {/* =========================
          SKILLS
      ========================= */}
      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Skills
        </h3>

        <div className="space-y-3">
          {skillCategories.map(
            (category) =>
              category.items.length > 0 && (
                <div key={category.title}>
                  <p className="text-xs font-medium text-slate-500 mb-1.5">
                    {category.title}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {category.items.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </section>


      {/* =========================
          EXPERIENCE
      ========================= */}
      {analysis.experience?.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Experience
          </h3>

          <div className="space-y-4">
            {analysis.experience.map((item, index) => (
              <div
                key={index}
                className="border-l-2 border-blue-200 pl-3"
              >
                <p className="text-sm font-medium text-slate-800">
                  {item.role}
                </p>

                {item.company && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    {item.company}
                  </p>
                )}

                {item.description && (
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


      {/* =========================
          PROJECTS
      ========================= */}
      {analysis.projects?.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Projects
          </h3>

          <div className="space-y-4">
            {analysis.projects.map((project, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-slate-800">
                  {project.name}
                </p>

                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.technologies.map(
                      (technology, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-600"
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                )}

                {project.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


      {/* =========================
          EDUCATION
      ========================= */}
      {analysis.education?.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Education
          </h3>

          <div className="space-y-3">
            {analysis.education.map((education, index) => (
              <div
                key={index}
                className="border-l-2 border-slate-200 pl-3"
              >
                <p className="text-sm font-medium text-slate-800">
                  {education.degree}
                </p>

                {education.institution && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    {education.institution}
                  </p>
                )}

                {education.details && (
                  <p className="text-xs text-slate-600 mt-1">
                    {education.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


      {/* =========================
          STRENGTHS
      ========================= */}
      {analysis.strengths?.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Strengths
          </h3>

          <ul className="space-y-1.5">
            {analysis.strengths.map((strength, index) => (
              <li
                key={index}
                className="text-xs text-slate-600 flex gap-2"
              >
                <span className="text-blue-500">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </section>
      )}


      {/* =========================
          AREAS FOR IMPROVEMENT
      ========================= */}
      {analysis.improvementAreas?.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Areas for Improvement
          </h3>

          <ul className="space-y-1.5">
            {analysis.improvementAreas.map((area, index) => (
              <li
                key={index}
                className="text-xs text-slate-600 flex gap-2"
              >
                <span className="text-orange-500">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}