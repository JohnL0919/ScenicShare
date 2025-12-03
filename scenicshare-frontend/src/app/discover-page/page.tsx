import NavBar from "@/app/discover-page/components/NavBar";
import Header from "@/app/discover-page/components/Header";
import DiscoverRoute from "@/app/discover-page/components/DiscoverRoute";
import Footer from "../landing-page/components/Footer";

export default function DiscoverPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 w-full h-full z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-50 blur-xs"
          style={{
            backgroundImage: "url('/scenic1.jpg')",
          }}
        />
      </div>
      <main className="relative z-10 grow flex flex-col">
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
