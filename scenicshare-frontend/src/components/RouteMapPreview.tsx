"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Type assertion for leaflet-routing-machine
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LWithRouting = L as any;

// Marker icon config (same as PathRouting.tsx)
const MARKER_ICON_CONFIG = {
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
};

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface RouteMapPreviewProps {
  waypoints: Waypoint[];
  className?: string;
}

// Inner component that has access to the map instance
function RouteLayer({ waypoints }: { waypoints: Waypoint[] }) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || waypoints.length === 0) return;

    // Fit bounds to show all waypoints
    const bounds = L.latLngBounds(waypoints.map((wp) => [wp.lat, wp.lng]));
    map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 14,
    });
  }, [map, waypoints]);

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const Routing = LWithRouting.Routing;
    if (!Routing) {
      console.warn("Leaflet Routing Machine not loaded");
      return;
    }

    // Convert waypoints to LatLng format
    const latLngs = waypoints.map((wp) => L.latLng(wp.lat, wp.lng));

    // Create routing control (read-only)
    const routingControl = Routing.control({
      waypoints: latLngs,
      lineOptions: {
        addWaypoints: false,
        styles: [{ opacity: 0.8, weight: 5, color: "#16a34a" }],
      },
      fitSelectedRoutes: false,
      show: false,
      draggableWaypoints: false,
      addWaypoints: false,
      router: Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving",
        timeout: 5000,
      }),
      createMarker: (i: number, waypoint: { latLng: L.LatLng }) => {
        // Create non-draggable markers
        const marker = L.marker(waypoint.latLng, {
          draggable: false, // READ-ONLY
          icon: L.icon(MARKER_ICON_CONFIG),
        });

        const waypointName = waypoints[i]?.name || `Stop ${i + 1}`;
        const isStart = i === 0;
        const isEnd = i === waypoints.length - 1;

        let label = waypointName;
        if (isStart) label = `🚗 Start: ${waypointName}`;
        else if (isEnd) label = `🏁 End: ${waypointName}`;

        marker.bindPopup(label);
        return marker;
      },
    }).addTo(map);

    routingControlRef.current = routingControl;

    // Handle routing errors gracefully
    routingControl.on("routingerror", () => {
      console.warn("Could not calculate route - showing markers only");
    });

    return () => {
      try {
        if (map && routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      } catch (error) {
        console.warn("Error cleaning up routing control:", error);
      }
    };
  }, [map, waypoints]);

  // Show simple markers if less than 2 waypoints (can't route)
  useEffect(() => {
    if (!map || waypoints.length >= 2) return;

    const markers: L.Marker[] = [];

    waypoints.forEach((waypoint, i) => {
      const marker = L.marker([waypoint.lat, waypoint.lng], {
        draggable: false,
        icon: L.icon(MARKER_ICON_CONFIG),
      });
      marker.bindPopup(waypoint.name || `Stop ${i + 1}`);
      marker.addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => {
        try {
          map.removeLayer(marker);
        } catch {
          // Ignore cleanup errors
        }
      });
    };
  }, [map, waypoints]);

  return null;
}

// Main exported component
export default function RouteMapPreview({
  waypoints,
  className = "",
}: RouteMapPreviewProps) {
  // Calculate initial center from waypoints
  const center: [number, number] =
    waypoints.length > 0
      ? [waypoints[0].lat, waypoints[0].lng]
      : [-33.8688, 151.2093]; // Default to Sydney

  if (waypoints.length === 0) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">No waypoints to display</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={false} // Disable scroll zoom in modal
        dragging={true} // Allow panning
        className="h-full w-full"
        style={{ minHeight: "250px" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <RouteLayer waypoints={waypoints} />
      </MapContainer>
    </div>
  );
}
