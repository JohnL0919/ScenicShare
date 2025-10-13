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

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface LeafletWaypoint {
  latLng: L.LatLng;
  name?: string;
  options?: Record<string, unknown>;
}

interface PathRoutingProps {
  waypoints?: Waypoint[];
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
}

export default function PathRouting({
  waypoints = [],
  onWaypointsChange,
}: PathRoutingProps) {
  const map = useMap();

  // Add double-click handler to add new waypoints
  useEffect(() => {
    if (!map) return;

    const dblclickHandler = (e: L.LeafletMouseEvent) => {
      // Only add new waypoints if we have the handler
      if (!onWaypointsChange) return;

      console.log("Double-clicked at:", e.latlng);

      // Create a new waypoint at the clicked location
      const newWaypoint: Waypoint = {
        id: `waypoint-${Date.now()}`, // Unique ID
        name: `Waypoint ${waypoints.length + 1}`, // Default name
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      // Add the new waypoint to existing waypoints
      const updatedWaypoints = [...waypoints, newWaypoint];
      onWaypointsChange(updatedWaypoints);
    };

    // Add the double-click handler
    map.on("dblclick", dblclickHandler);

    // Cleanup on unmount or when dependencies change
    return () => {
      map.off("dblclick", dblclickHandler);
    };
  }, [map, waypoints, onWaypointsChange]);

  // Display standalone markers when there are less than 2 waypoints
  useEffect(() => {
    if (!map || waypoints.length >= 2) return;

    const markers: L.Marker[] = [];

    waypoints.forEach((waypoint) => {
      const marker = L.marker([waypoint.lat, waypoint.lng], {
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

      marker.bindPopup(
        `${waypoint.name}<br>Double-click map to add more waypoints!`
      );
      marker.addTo(map);

      // Handle marker drag
      marker.on("dragend", () => {
        if (!onWaypointsChange) return;

        const newLatLng = marker.getLatLng();
        const updatedWaypoints = waypoints.map((wp) =>
          wp.id === waypoint.id
            ? { ...wp, lat: newLatLng.lat, lng: newLatLng.lng }
            : wp
        );
        onWaypointsChange(updatedWaypoints);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => map.removeLayer(marker));
    };
  }, [map, waypoints, onWaypointsChange]);

  // Routing control for 2+ waypoints
  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const Routing = LWithRouting.Routing;
    if (!Routing) return;

    // Convert waypoints to LatLng format
    const latLngs = waypoints.map((wp) => L.latLng(wp.lat, wp.lng));

    const routingControl = Routing.control({
      waypoints: latLngs,
      lineOptions: {
        addWaypoints: false,
        styles: [{ opacity: 0.8, weight: 6, color: "#3b82f6" }],
      },
      fitSelectedRoutes: true,
      show: false,
      draggableWaypoints: true,
      addWaypoints: false,
      router: Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving",
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createMarker: function (
        i: number,
        waypoint: LeafletWaypoint,
        _n: number
      ) {
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

        // Get waypoint name from our waypoints array
        const waypointName = waypoints[i]?.name || `Waypoint ${i + 1}`;
        marker.bindPopup(`${waypointName}<br>Drag to customize your route!`);

        return marker;
      },
      routeWhileDragging: true,
    }).addTo(map);

    // Listen for waypoint changes (when user drags markers)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routingControl.on("waypointschanged", (e: any) => {
      if (!onWaypointsChange) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedWaypoints = e.waypoints.map((wp: any, index: number) => ({
        id: waypoints[index]?.id || `waypoint-${index}`,
        name: waypoints[index]?.name || `Waypoint ${index + 1}`,
        lat: wp.latLng.lat,
        lng: wp.latLng.lng,
      }));

      onWaypointsChange(updatedWaypoints);
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
  }, [map, waypoints, onWaypointsChange]);

  return null;
}
