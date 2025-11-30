import NavBar from "@/app/protected/home-page/components/NavBar";
import Header from "@/app/protected/home-page/components/Header";
import DiscoverRoute from "@/app/protected/home-page/components/DiscoverRoute";
import Footer from "../../landing-page/components/Footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-50 blur-xs"
        >
          <source
            src="https://firebasestorage.googleapis.com/v0/b/scenicshare-c3d7c.firebasestorage.app/o/videos%2Fscenicvid4.mp4?alt=media"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
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
