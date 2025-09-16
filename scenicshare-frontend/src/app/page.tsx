import NavBar from "@/components/NavBar";
import Image from "next/image";
import backgroundImage from "../../public/scenic1.jpg";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Scenic background"
          fill
          style={{ objectFit: "cover", opacity: 0.4 }}
          priority
        />
      </div>
      <main className="relative z-10">
        <NavBar />
      </main>
    </div>
  );
}
