import HeroSection from "../components/landing/HeroSection";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <HeroSection />
      <Footer />
    </div>
  );
}

export default Home;