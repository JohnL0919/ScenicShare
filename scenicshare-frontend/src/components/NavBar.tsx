"use client";

import { useState } from "react";
import Button from "./Button";
import SearchBar from "./SearchBar";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="backdrop-blur-sm bg-black/30 rounded-lg shadow-lg mx-20 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-green-700">Scenic</span>Share
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button text="Discover" />
            <Button text="My Routes" />
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-grow mx-8">
            <SearchBar />
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button text="Share Route +" variant="primary" />
            <Button text="Profile" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button text="Discover" />
            <Button text="My Routes" />
            <Button text="Favourites" />
            <div className="py-2">
              <SearchBar />
            </div>
            <Button text="Share Route +" variant="primary" />
            <Button text="Profile" />
          </div>
        </div>
      )}
    </nav>
  );
}
