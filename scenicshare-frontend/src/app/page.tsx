import NavBar from "@/components/NavBar";
import Image from "next/image";
import backgroundImage from "../../public/scenic1.jpg";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src={backgroundImage}
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
      <main className="relative z-10 min-h-screen">
        <NavBar />
        <Header />
      </main>
    </div>
  );
}
