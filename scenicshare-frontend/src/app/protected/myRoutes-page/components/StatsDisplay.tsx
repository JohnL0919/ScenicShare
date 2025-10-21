"use client";

import React from "react";

interface FeaturedRouteProps {
  routeId?: string;
  randomize?: boolean;
}

export default function StatsDisplay({}: FeaturedRouteProps) {
  // Select the route based on props

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2 w-full">
        <div className="text-center p-2">
          <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">12</div>
          <div className="text-lg sm:text-xl text-gray-300">Routes</div>
        </div>

        <div className="text-center p-2">
          <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            2,847
          </div>
          <div className="text-lg sm:text-xl text-gray-300">Kilometers</div>
        </div>

        <div className="text-center p-2">
          <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">34</div>
          <div className="text-lg sm:text-xl text-gray-300">Favourites</div>
        </div>
      </div>
    </div>
  );
}
