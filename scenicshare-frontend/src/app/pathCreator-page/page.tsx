"use client";

import { MapContainer, TileLayer, useMap, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

export default function PathCreatorPage() {
  useEffect(() => {
    // This is needed to fix the missing icon problem in Leaflet with Next.js
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
    <div style={{ height: "100vh", width: "100%", margin: 0, padding: 0 }}>
      <MapContainer
        center={[-33.8688, 151.2093]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-33.8688, 151.2093]}>
          <Popup>Sydney, Australia</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
