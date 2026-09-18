import UploadCard from "../components/dashboard/UploadCard";
import PrivateNavbar from "../components/layout/PrivateNavbar";
import Footer from "../components/layout/Footer";

function Dashboard() {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Private Navbar */}
      <PrivateNavbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Welcome */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Welcome back{user?.name ? `, ${user.name}` : ""} 👋
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Upload your resume and discover personalised career insights.
          </p>
        </div>

        {/* Upload Resume */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="w-full max-w-2xl">
            <UploadCard />
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Dashboard;