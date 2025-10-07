import NavBar from "@/app/home-page/components/NavBar";
import Header from "@/app/home-page/components/Header";
import DiscoverRoute from "../landing-page/components/DiscoverRoute";
import Footer from "../landing-page/components/Footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 w-full h-full z-0">
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src="/scenicvid1.mp4" />
        </video>
      </div>
      <main className="relative z-10 flex-grow flex flex-col">
        <NavBar />
        <Header />
        <DiscoverRoute />
      </main>
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}
