"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Type assertion for leaflet-routing-machine
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LWithRouting = L as any;

interface RouteData {
  distanceMeters: number;
  durationSeconds: number;
  polyline: [number, number][];
}

interface Waypoint {
  latLng: L.LatLng;
  name?: string;
  options?: Record<string, unknown>;
}

interface PathRoutingProps {
  from?: L.LatLngTuple;
  to?: L.LatLngTuple;
  onRouteDataChange?: (data: RouteData) => void;
}

export default function PathRouting({
  from = [-33.8688, 151.2093], // Default: Sydney Opera House
  to = [-33.9173, 151.2313], // Default: Sydney Airport
  onRouteDataChange,
}: PathRoutingProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // TS: L.Routing is added by the side-effect import above
    const Routing = LWithRouting.Routing;
    if (!Routing) return;

    const routingControl = Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      lineOptions: {
        addWaypoints: true, // Allow users to add waypoints by clicking on the route
        styles: [{ opacity: 0.8, weight: 6, color: "#3b82f6" }],
      },
      fitSelectedRoutes: true,
      show: false, // Hide the routing panel
      draggableWaypoints: true, // Enable dragging waypoints
      addWaypoints: true, // Allow adding waypoints by clicking on route
      router: Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving", // 'driving' | 'walking' | 'cycling'
      }),
      createMarker: function (i: number, waypoint: Waypoint, n: number) {
        // Custom markers that are draggable
        const marker = L.marker(waypoint.latLng, {
          draggable: true,
          icon: L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        });

        // Add popup with waypoint info
        const waypointNames = ["Start", "Waypoint", "End"];
        const name =
          i === 0
            ? waypointNames[0]
            : i === n - 1
            ? waypointNames[2]
            : `${waypointNames[1]} ${i}`;
        marker.bindPopup(`${name}<br>Drag to customize your route!`);

        return marker;
      },
      routeWhileDragging: true,
    }).addTo(map);

    // Emit route data to parent component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routingControl.on("routesfound", (e: any) => {
      const route = e.routes?.[0];
      if (!route || !onRouteDataChange) return;

      const distanceMeters = route.summary?.totalDistance ?? 0;
      const durationSeconds = route.summary?.totalTime ?? 0;
      const polyline: [number, number][] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        route.coordinates?.map((c: any) => [c.lat, c.lng]) ?? [];

      onRouteDataChange({ distanceMeters, durationSeconds, polyline });
    });

    // Handle routing errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routingControl.on("routingerror", (err: any) => {
      console.warn("Routing error:", err);
    });

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, from, to, onRouteDataChange]);

  return null;
}
