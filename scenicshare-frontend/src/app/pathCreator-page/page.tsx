"use client";

import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import Button from "./components/Button";

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
      <style>{`
        .overlay-btn-container {
          position: absolute;
          top: 1rem;
          left: 3rem;
          z-index: 1000;
        }
        @media (max-width: 600px) {
          .overlay-btn-container {
            top: auto;
            bottom: 1rem;
            left: 1rem;
            transform: none;
            width: auto;
            max-width: 120px;
            padding: 0;
          }
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
      <div
        style={{
          height: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
          position: "relative",
        }}
      >
        <div className="overlay-btn-container">
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
        <MapContainer
          center={[-33.8688, 151.2093]}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
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
