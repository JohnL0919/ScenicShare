"use client";

import React from "react";
import Button from "@/app/landing-page/components/Button";

interface FeaturedRouteProps {
  routeId?: string;
  randomize?: boolean;
}

export default function StatsDisplay({}: FeaturedRouteProps) {
  // Select the route based on props

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-3 gap-8 w-full">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">12</div>
          <div className="text-xl text-gray-300">Routes</div>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold mb-2">2,847</div>
          <div className="text-xl text-gray-300">Kilometers</div>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold mb-2">34</div>
          <div className="text-xl text-gray-300">Favourites</div>
        </div>
      </div>
    </div>
  );
}
