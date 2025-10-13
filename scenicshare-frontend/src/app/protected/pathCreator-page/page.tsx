"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import L from "leaflet";
import Button from "./components/Button";
import ControlPanel from "./components/ControlPanel";
import NavBar from "./components/NavBar";
import PathRouting from "./components/PathRouting";

export default function PathCreatorPage() {
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
        {/* Top NavBar */}
        <div className="absolute top-0 left-0 right-0 z-[1000]">
          <NavBar />
        </div>

        {/* Back Button */}
        <div className="absolute top-20 left-4 z-[999]">
          <Button
            variant="primary"
            href="/protected/home-page"
            text={
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                  />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </div>
            }
          />
        </div>

        {/* Control Panel */}
        <ControlPanel
          onRouteDataChange={(data) => {
            console.log("Route data updated:", data);
          }}
        />

        <MapContainer
          center={[-33.8688, 151.2093]} // Center on Sydney Opera House
          zoom={11} // Closer zoom to see Sydney area details
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            className="bright-tiles"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />

          <PathRouting
            onRouteDataChange={(data) => {
              console.log("Route data updated:", data);
              // You can pass this data to ControlPanel or other components
            }}
          />
        </MapContainer>
      </div>
    </>
  );
}
