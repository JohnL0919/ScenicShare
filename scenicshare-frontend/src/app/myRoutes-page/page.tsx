import NavBar from "@/app/myRoutes-page/components/NavBar";
import Image from "next/image";
import Header from "@/app/myRoutes-page/components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/scenic1.jpg"
          alt="Scenic background"
          fill
          style={{
            objectFit: "cover",
            opacity: 0.4,
            objectPosition: "center",
          }}
          priority
          quality={100}
        />
      </div>
      <main className="relative z-10 min-h-screen justify-center">
        <NavBar />
        <Header />
        <Footer />
      </main>
    </div>
  );
}
