"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContexts";
import SearchBar from "@/app/landing-page/components/SearchBar";
import Button from "@/app/landing-page/components/Button";
import Link from "next/link";

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
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              <Link href="/landing-page">
                <span className="text-green-700">Scenic</span>Share
              </Link>
            </h1>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4 ml-2 xl:ml-5">
            <div className="w-24">
              <Button text="Discover" size="compact" />
            </div>
            <div className="w-24">
              <Button text="My Routes" size="compact" />
            </div>
          </div>

          <div className="hidden lg:block flex-grow mx-2 xl:mx-8">
            <SearchBar />
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
            <div className="w-24">
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button text="Discover" />
            <Button text="My Routes" />
            <Button text="Favourites" />
            <div className="py-2">
              <SearchBar />
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
