"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-0 bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-white rounded-lg p-2 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h2 className="text-xl font-bold">ScenicShare</h2>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Discover and share the world&apos;s most breathtaking scenic
              driving routes. Join our community of adventurers and create
              unforgettable journeys.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Discover Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/protected/home-page"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Browse Routes
                </Link>
              </li>
              <li>
                <Link
                  href="/protected/myRoutes-page"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  My Routes
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/protected/pathCreator-page"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Create a Route
                </Link>
              </li>
              <li>
                <Link
                  href="/registration-page"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/login-page"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and links */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} ScenicShare. All rights
              reserved.
            </p>
            <div className="flex flex-wrap space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-500 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white text-sm">
                Cookie Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
