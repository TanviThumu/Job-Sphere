import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <div className="max-w-3xl">

        <p className="text-blue-600 font-semibold mb-2">
          AI-Powered Career Platform
        </p>

        <h1 className="text-6xl font-extrabold leading-tight text-slate-900">
          Land Better Jobs with
          <span className="text-blue-600"> JobSphere</span>
        </h1>

        <p className="mt-8 text-xl text-slate-600 leading-9">
          Analyze your resume, improve your ATS score,
          discover missing skills, estimate your salary,
          and receive personalized job recommendations
          powered by AI.
        </p>

        <div className="mt-10 flex gap-4">

          <Link
            to="/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;