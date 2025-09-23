import NavBar from "../landing-page/components/NavBar";
import Image from "next/image";
import Header from "./components/Header";
import RegistrationForm from "./components/RegistrationForm";

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="fixed inset-0 w-full h-full z-0 ">
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
      <main className="relative z-10 h-full flex flex-col pt-[10%]">
        <NavBar />
        <Header />
        <RegistrationForm />
      </main>
    </div>
  );
}
