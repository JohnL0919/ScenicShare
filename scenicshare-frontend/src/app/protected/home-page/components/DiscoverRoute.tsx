"use client";

import * as React from "react";
import Image from "next/image";
import { getAllRoutes, PathData } from "@/services/routes";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export default function DiscoverRoute() {
  const [routes, setRoutes] = React.useState<PathData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastDoc, setLastDoc] =
    React.useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { routes: fetchedRoutes, lastDoc: newLastDoc } =
          await getAllRoutes(6);
        setRoutes(fetchedRoutes);
        setLastDoc(newLastDoc);
        setHasMore(fetchedRoutes.length === 6);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Function to load more routes (for future "Load More" button)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { routes: moreRoutes, lastDoc: newLastDoc } = await getAllRoutes(
        6,
        lastDoc
      );
      setRoutes((prev) => [...prev, ...moreRoutes]);
      setLastDoc(newLastDoc);
      setHasMore(moreRoutes.length === 6);
    } catch (error) {
      console.error("Error loading more routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = (route: PathData): string => {
    return route.location || "Unknown location";
  };

  const getRouteImage = (route: PathData): string => {
    return route.imageUrl || "/scenic1.jpg";
  };

  if (loading) {
    return (
      <div className="mt-8 px-4 sm:px-6 lg:px-8 w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white text-lg">Loading routes...</p>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="mt-8 px-4 sm:px-6 lg:px-8 w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-white text-xl mb-2">No routes available yet</p>
          <p className="text-white/70">Be the first to share a scenic route!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8 w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto pb-16">
      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {routes.map((route, index) => (
          <div
            key={route.id}
            className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src={getRouteImage(route)}
                alt={route.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Waypoint Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-gray-800">
                  {route.waypointCount} stops
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {route.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm line-clamp-1">
                  {getLocation(route)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {route.description}
              </p>

              {/* View Button */}
              <button className="w-full bg-green-900 hover:bg-green-800 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
                View Route
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
