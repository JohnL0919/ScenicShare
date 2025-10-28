"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PathData } from "@/services/routes";

interface RouteModalProps {
  route: PathData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RouteModal({
  route,
  isOpen,
  onClose,
}: RouteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Generate Google Maps URL for navigation
  const generateGoogleMapsUrl = (route: PathData): string => {
    if (!route.waypoints || route.waypoints.length < 2) {
      return "";
    }

    const startWaypoint = route.waypoints[0];
    const endWaypoint = route.waypoints[route.waypoints.length - 1];

    if (route.waypoints.length > 2) {
      const intermediateWaypoints = route.waypoints
        .slice(1, -1)
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join("|");

      return `https://www.google.com/maps/dir/?api=1&origin=${startWaypoint.lat},${startWaypoint.lng}&destination=${endWaypoint.lat},${endWaypoint.lng}&waypoints=${intermediateWaypoints}&travelmode=driving`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${startWaypoint.lat},${startWaypoint.lng}&destination=${endWaypoint.lat},${endWaypoint.lng}&travelmode=driving`;
  };

  const handleStartNavigation = () => {
    if (!route) return;

    const mapsUrl = generateGoogleMapsUrl(route);
    if (mapsUrl) {
      window.open(mapsUrl, "_blank");
    } else {
      alert("This route needs at least 2 waypoints to start navigation.");
    }
  };

  if (!isOpen || !route || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 w-full flex-shrink-0 rounded-t-2xl overflow-hidden">
          <Image
            src={route.imageUrl || "/scenic1.jpg"}
            alt={route.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Waypoint Badge */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm font-semibold text-gray-800">
              {route.waypointCount} stops
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {route.title}
          </h2>

          {/* Location */}
          {route.location && (
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <svg
                className="w-5 h-5"
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
              <span className="text-base">{route.location}</span>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{route.description}</p>
          </div>

          {/* Map Placeholder - Simple visualization */}
          {route.waypoints && route.waypoints.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Route Map
              </h3>
              <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
                <svg
                  className="w-16 h-16 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="text-gray-600 text-center">
                  Interactive map coming soon
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {route.waypointCount} stops along this route
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        <div className="flex-shrink-0 border-t bg-white p-4 rounded-b-2xl sticky bottom-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
            >
              Close
            </button>
            <button
              onClick={handleStartNavigation}
              disabled={!route.waypoints || route.waypoints.length < 2}
              className="flex-1 bg-green-900 hover:bg-green-800 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Start Navigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
