"use client";

import { useState, useEffect } from "react";
import Button from "./Button";
import SearchBar from "./SearchBar";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/30 rounded-lg shadow-lg mx-2 sm:mx-4 md:mx-8 lg:mx-20 mt-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              <span className="text-green-700">Scenic</span>Share
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4 ml-2 xl:ml-5">
            <div className="w-24">
              <Button text="Discover" size="compact" />
            </div>
            <div className="w-24">
              <Button text="My Routes" size="compact" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-grow mx-2 xl:mx-8">
            <SearchBar />
          </div>

          {/* Right Side Buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
            <div className="w-20">
              <Button text="Share +" variant="primary" size="compact" />
            </div>
            <div className="w-24">
              <Button text="Profile" size="compact" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button text="Discover" />
            <Button text="My Routes" />
            <Button text="Favourites" />
            <div className="py-2">
              <SearchBar />
            </div>
            <Button text="Share +" variant="primary" />
            <Button text="Profile" />
          </div>
        </div>
      )}
    </nav>
  );
}
