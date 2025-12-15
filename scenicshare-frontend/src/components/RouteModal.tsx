"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PathData } from "@/services/routes";
import { useAuth } from "@/contexts/authContexts";
import {
  checkLocationPermission,
  requestLocationPermission,
} from "@/lib/firebase/location";
import toast from "react-hot-toast";
import LocationPermissionModal from "./LocationPermissionModal";

interface RouteModalProps {
  route: PathData | null;
  isOpen: boolean;
  onClose: () => void;
}

// Dynamic import to avoid SSR issues with Leaflet
const RouteMapPreview = dynamic(() => import("./RouteMapPreview"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-lg h-[250px] flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading map...</div>
    </div>
  ),
});

export default function RouteModal({
  route,
  isOpen,
  onClose,
}: RouteModalProps) {
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

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
  const generateGoogleMapsUrl = (
    route: PathData,
    userLocation?: { lat: number; lng: number }
  ): string => {
    if (!route.waypoints || route.waypoints.length < 2) {
      return "";
    }

    // Use user's current location as origin if available, otherwise use first waypoint
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : `${route.waypoints[0].lat},${route.waypoints[0].lng}`;

    const endWaypoint = route.waypoints[route.waypoints.length - 1];
    const destination = `${endWaypoint.lat},${endWaypoint.lng}`;

    // Include all waypoints if using user location, otherwise skip first waypoint
    const waypointsToUse = userLocation
      ? route.waypoints
      : route.waypoints.slice(1, -1);

    if (waypointsToUse.length > 0) {
      const intermediateWaypoints = waypointsToUse
        .slice(0, -1) // Exclude last waypoint (destination)
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join("|");

      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${intermediateWaypoints}&travelmode=driving`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  const handleStartNavigation = async () => {
    if (!route) return;
    if (!currentUser?.uid) {
      toast.error("You must be logged in to start navigation");
      return;
    }

    try {
      // Check location permission first
      const hasPermission = await checkLocationPermission(currentUser.uid);

      if (!hasPermission) {
        // Show location permission modal
        setShowLocationModal(true);
        return;
      }

      // Get user's current location
      let userLocation: { lat: number; lng: number } | undefined;
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          }
        );
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (error) {
        console.error("Could not get current location:", error);
        // Continue without user location - will use first waypoint
      }

      // Proceed with navigation
      const mapsUrl = generateGoogleMapsUrl(route, userLocation);
      if (mapsUrl) {
        window.open(mapsUrl, "_blank");
      } else {
        toast.error(
          "This route needs at least 2 waypoints to start navigation."
        );
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      toast.error("Failed to check location permission");
    }
  };

  const handleAllowLocation = async () => {
    if (!currentUser?.uid || !route) return;

    try {
      const granted = await requestLocationPermission(currentUser.uid);

      if (granted) {
        toast.success("Location access granted!");
        setShowLocationModal(false);

        // Get user's current location
        let userLocation: { lat: number; lng: number } | undefined;
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              });
            }
          );
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (error) {
          console.error("Could not get current location:", error);
        }

        // Now start navigation with user location
        const mapsUrl = generateGoogleMapsUrl(route, userLocation);
        if (mapsUrl) {
          window.open(mapsUrl, "_blank");
        }
      } else {
        toast.error("Location access denied by browser");
        setShowLocationModal(false);
      }
    } catch (error) {
      console.error("Error granting location permission:", error);
      toast.error("Failed to update location permission");
    }
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
    toast("Location access is required for navigation", { icon: "ℹ️" });
  };

  if (!mounted) return null;

  const modalContent =
    !isOpen || !route ? null : (
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
          <div className="relative h-64 w-full shrink-0 rounded-t-2xl overflow-hidden">
            <Image
              src={route.imageUrl || "/scenic1.jpg"}
              alt={route.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

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
              <p className="text-gray-700 leading-relaxed">
                {route.description}
              </p>
            </div>

            {/* Map Placeholder - Simple visualization */}
            {/* Interactive Route Map */}
            {route.waypoints && route.waypoints.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Route Map
                </h3>
                <RouteMapPreview
                  waypoints={route.waypoints}
                  className="h-[250px] border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Sticky Action Buttons */}
          <div className="shrink-0 border-t bg-white p-4 rounded-b-2xl sticky bottom-0">
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
                Start Navigation
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <>
      {modalContent && createPortal(modalContent, document.body)}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />
    </>
  );
}
