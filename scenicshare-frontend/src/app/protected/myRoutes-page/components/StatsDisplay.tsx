"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContexts";
import { getUserRouteCount } from "@/services/routes";

interface FeaturedRouteProps {
  routeId?: string;
  randomize?: boolean;
}

export default function StatsDisplay({}: FeaturedRouteProps) {
  const { currentUser } = useAuth();
  const [routeCount, setRouteCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteCount = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const count = await getUserRouteCount(currentUser.uid);
        setRouteCount(count);
      } catch (error) {
        console.error("Error fetching route count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteCount();
  }, [currentUser]);

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2 w-full">
        <div className="text-center p-2">
          <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            {loading ? "..." : routeCount}
          </div>
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
