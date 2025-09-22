import NavBar from "@/app/landing-page/components/NavBar";
import Image from "next/image";
import Header from "@/app/landing-page/components/Header";
import FeaturedRoute from "./components/FeaturedRoute";

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
        {/* You can choose which route to display using these props:
          Default route (first one):    <FeaturedRoute />
          Specific route by ID:         <FeaturedRoute routeId="2" />
          Random route:                 <FeaturedRoute randomize={true} />
        */}
        <FeaturedRoute />
      </main>
    </div>
  );
}
