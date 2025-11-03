"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import L from "leaflet";
import Button from "./components/Button";
import ControlPanel from "./components/ControlPanel";
import PathRouting from "./components/PathRouting";
import { getRouteById } from "@/services/routes";
import { useAuth } from "@/contexts/authContexts";

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export default function PathEditorPage() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id");
  const { currentUser } = useAuth();

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    isPublic: boolean;
  } | null>(null);

  // Fix default marker icons in bundlers
  useEffect(() => {
    const iconDefault = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    // Override default marker icon
    (L.Marker.prototype.options as { icon: L.Icon }).icon = iconDefault;
  }, []);

  // Load route data
  useEffect(() => {
    const loadRoute = async () => {
      if (!routeId) {
        setError("No route ID provided");
        setLoading(false);
        return;
      }

      if (!currentUser?.uid) {
        setError("You must be logged in to edit routes");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const route = await getRouteById(routeId);

        if (!route) {
          setError("Route not found");
          setLoading(false);
          return;
        }

        // Check if user owns this route
        if (route.creatorID !== currentUser.uid) {
          setError("You don't have permission to edit this route");
          setLoading(false);
          return;
        }

        // Set route data
        setInitialData({
          title: route.title,
          description: route.description,
          imageUrl: route.imageUrl || "",
          location: route.location || "",
          isPublic: route.isPublic || false,
        });
        setWaypoints(route.waypoints || []);
        setError(null);
      } catch (err) {
        console.error("Error loading route:", err);
        setError("Failed to load route");
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [routeId, currentUser]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading route...</p>
        </div>
      </div>
    );
  }

  if (error || !routeId || !initialData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-medium">
              {error || "Invalid route"}
            </p>
          </div>
          <Button
            variant="primary"
            size="normal"
            href="/protected/myRoutes-page"
            text="Back to My Routes"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @media (max-width: 600px) {
          .overlay-btn-container button {
            width: 100%;
            font-size: 0.8rem;
            padding: 0.35rem 0.5rem;
          }
          .btn-text {
            display: none;
          }
        }
      `}</style>

      <div className="h-screen w-full m-0 p-0 relative">
        {/* Back Button */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[999] opacity-90">
          <Button
            variant="primary"
            size="normal"
            href="/protected/myRoutes-page"
            text={
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                <span className="font-semibold">Back</span>
              </div>
            }
          />
        </div>

        {/* Control Panel */}
        <ControlPanel
          routeId={routeId}
          waypoints={waypoints}
          onWaypointsChange={setWaypoints}
          initialTitle={initialData.title}
          initialDescription={initialData.description}
          initialImageUrl={initialData.imageUrl}
          initialLocation={initialData.location}
          initialIsPublic={initialData.isPublic}
        />

        <MapContainer
          center={
            waypoints.length > 0
              ? [waypoints[0].lat, waypoints[0].lng]
              : [-33.8688, 151.2093]
          }
          zoom={5}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            className="bright-tiles"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />

          <PathRouting waypoints={waypoints} onWaypointsChange={setWaypoints} />
        </MapContainer>
      </div>
    </>
  );
}
