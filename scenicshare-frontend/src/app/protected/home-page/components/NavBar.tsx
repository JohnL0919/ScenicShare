"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/landing-page/components/Button";
import Link from "next/link";
import { useAuth } from "@/contexts/authContexts";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/landing-page");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/30 rounded-lg shadow-lg mx-2 sm:mx-4 md:mx-8 lg:mx-20 mt-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              <Link href="/landing-page">
                <span className="text-green-700">Scenic</span>Share
              </Link>
            </h1>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4 absolute left-1/2 -translate-x-1/2">
            <div className="w-24">
              <Button href="/protected/home-page" text="Home" size="compact" />
            </div>
            <div className="w-24">
              <Button href="/discover-page" text="Discover" size="compact" />
            </div>
            <div className="w-24">
              <Button
                href="/protected/myRoutes-page"
                text="My Routes"
                size="compact"
              />
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blur hover:bg-red-700 rounded-lg transition-colors duration-200"
            >
              Log Out
            </button>
          </div>

          {/* Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <MenuIcon
                  className={`absolute transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "opacity-0 rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                  sx={{ fontSize: 28 }}
                />
                <CloseIcon
                  className={`absolute transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  }`}
                  sx={{ fontSize: 28 }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-3 sm:px-6 border-t border-white/10">
          <div className="space-y-2">
            <Button href="/protected/home-page" text="Home" />
            <Button href="/discover-page" text="Discover" />
            <Button href="/protected/myRoutes-page" text="My Routes" />
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
