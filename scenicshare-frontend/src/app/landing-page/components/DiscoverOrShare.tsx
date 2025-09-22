"use client";

import Button from "./Button";
import { useEffect, useState } from "react";

export default function DiscoverOrShare() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-black/50 text-white py-12 mt-16">
      <h1 className="text-center mb-2 text-3xl mt-8 px-4">
        Share Your Route Today{" "}
      </h1>
      <h4 className="text-center mb-10 px-4 max-w-3xl mx-auto">
        Inspire fellow travelers by sharing your most scenic routes. Join our
        community of adventurers.
      </h4>
      <div className="flex flex-col md:flex-row justify-evenly max-w-5xl mx-auto px-4 gap-8 md:gap-4">
        <div className="flex flex-col items-center">
          <div
            className={`bg-gray-800 rounded-full p-6 mb-4 transition-all duration-500 hover:scale-110 hover:shadow-lg hover:bg-gray-700 ${
              isVisible ? "animate-fadeIn" : "opacity-0 -translate-y-4"
            }`}
            style={{ animationDelay: "0ms" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white transition-transform duration-300 hover:rotate-12"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h3 className="font-bold text-2xl">Easy Upload</h3>
          <p>Share photos and routes in minutes</p>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`bg-gray-800 rounded-full p-6 mb-4 transition-all duration-500 hover:scale-110 hover:shadow-lg hover:bg-gray-700 ${
              isVisible ? "animate-fadeIn" : "opacity-0 -translate-y-4"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            </svg>
          </div>
          <h3 className="font-bold text-2xl">Join Community</h3>
          <p>Connect with fellow adventurers</p>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`bg-gray-800 rounded-full p-6 mb-4 transition-all duration-500 hover:scale-110 hover:shadow-lg hover:bg-gray-700 ${
              isVisible ? "animate-fadeIn" : "opacity-0 -translate-y-4"
            }`}
            style={{ animationDelay: "400ms" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M9 5v8"></path>
              <path d="M15 5v8"></path>
              <path d="M12 5V3"></path>
            </svg>
          </div>
          <h3 className="font-bold text-2xl">Gain Recognition</h3>
          <p>Build your reputation as curator</p>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <div className="w-64">
          <Button text="Share Your Route" variant="primary" />
        </div>
      </div>
    </div>
  );
}
