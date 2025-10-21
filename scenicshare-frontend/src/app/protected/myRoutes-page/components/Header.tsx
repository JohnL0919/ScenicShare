"use client";

import StatsDisplay from "./StatsDisplay";
import Button from "@/app/protected/home-page/components/Button";

export default function Header() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8 w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto mt-20 sm:mt-28 lg:mt-32">
      {/* Left column - Welcome text */}
      <div className="flex flex-col">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl mt-3">
          Your Routes
          <br />
        </h1>

        <h5 className="my-3 sm:my-5 text-sm sm:text-base">
          Explore breathtaking routes curated by fellow adventurers. Your next
          journey awaits.
        </h5>
        <div className="w-full sm:w-64">
          <Button
            variant="primary"
            href="/protected/pathCreator-page"
            text={
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create New Path
              </div>
            }
          />
        </div>
      </div>

      {/* Right column - Stats */}
      <div className="order-first md:order-last">
        <StatsDisplay />
      </div>
    </div>
  );
}
