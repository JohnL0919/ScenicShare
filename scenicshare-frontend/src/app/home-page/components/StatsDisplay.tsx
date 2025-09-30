"use client";

import React from "react";
import { scenicRouteMockData, ScenicRouteData } from "@/lib/mockData";
import Button from "@/app/landing-page/components/Button";

interface FeaturedRouteProps {
  routeId?: string;
  randomize?: boolean;
}

export default function StatsDisplay({ routeId }: FeaturedRouteProps) {
  // Select the route based on props
  const route: ScenicRouteData = React.useMemo(() => {
    // If routeId is provided, find that specific route
    if (routeId) {
      const foundRoute = scenicRouteMockData.find((r) => r.id === routeId);
      if (foundRoute) return foundRoute;
    }

    // Default to first route
    return scenicRouteMockData[0];
  }, [routeId]);

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-3 gap-8 w-full">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">12</div>
          <div className="text-xl text-gray-300">Shared Routes</div>
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
