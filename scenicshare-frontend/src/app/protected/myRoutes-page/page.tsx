import NavBar from "@/app/protected/myRoutes-page/components/NavBar";
import Image from "next/image";
import Header from "@/app/protected/myRoutes-page/components/Header";
import Footer from "./components/Footer";
import YourRoute from "./components/YourRoute";

export default function MyRoutes() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/scenic1.jpg"
          alt="Scenic background"
          fill
          className="blur-xs"
          style={{
            objectFit: "cover",
            opacity: 0.4,
            objectPosition: "center",
          }}
          priority
          quality={100}
        />
      </div>
      <main className="relative z-10 grow">
        <NavBar />
        <Header />
        <YourRoute />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
