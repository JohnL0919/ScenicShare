"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import L from "leaflet";
import Button from "./components/Button";
import ControlPanel from "./components/ControlPanel";
import PathRouting from "./components/PathRouting";

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export default function PathCreatorPage() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    {
      id: "start",
      name: "Start",
      lat: -33.8688,
      lng: 151.2093,
    },
    {
      id: "end",
      name: "End",
      lat: -33.9173,
      lng: 151.2313,
    },
  ]);

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
            href="/protected/home-page"
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
        <ControlPanel waypoints={waypoints} onWaypointsChange={setWaypoints} />

        <MapContainer
          center={[-33.8688, 151.2093]}
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
