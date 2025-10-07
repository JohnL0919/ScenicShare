"use client";

import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import Button from "./components/Button";
import ControlPanel from "./components/ControlPanel";

export default function PathCreatorPage() {
  useEffect(() => {
    const iconUrl =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
    const shadowUrl =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";
    const iconDefault = L.icon({
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;
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
        <div className="absolute top-4 left-12 z-[1000] sm:top-auto sm:bottom-4 sm:left-4 sm:w-auto sm:max-w-[120px] sm:p-0">
          <Button
            variant="primary"
            href="/home-page"
            text={
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                  />
                </svg>
                <span className="btn-text">Go Back to Home</span>{" "}
              </div>
            }
          />
        </div>
        <ControlPanel
          onRouteDataChange={(data) => {
            console.log("Route data updated:", data);
          }}
        />
        <MapContainer
          center={[-33.8688, 151.2093]}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            className="bright-tiles"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />
          <Marker position={[-33.8688, 151.2093]}>
            <Popup>Sydney, Australia</Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
}
