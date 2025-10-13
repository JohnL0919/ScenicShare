"use client";

import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine"; // <-- important: extends L with L.Routing

import { useEffect } from "react";
import L from "leaflet";
import Button from "./components/Button";
import ControlPanel from "./components/ControlPanel";
import NavBar from "./components/NavBar";

const p1: L.LatLngTuple = [-33.8688, 151.2093]; // Sydney
const p2: L.LatLngTuple = [-37.8136, 144.9631]; // Melbourne

function Routing({
  from,
  to,
  onRouteDataChange,
}: {
  from: L.LatLngTuple;
  to: L.LatLngTuple;
  onRouteDataChange?: (data: {
    distanceMeters: number;
    durationSeconds: number;
    polyline: [number, number][];
  }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    // TS: L.Routing is added by the side-effect import above
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Routing = (L as any).Routing;
    if (!Routing) return;

    const control = Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      lineOptions: { addWaypoints: false, styles: [{ opacity: 1, weight: 5 }] },
      fitSelectedRoutes: true,
      show: false,
      router: Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving", // 'driving' | 'walking' | 'cycling'
      }),
      createMarker: () => null, // hide default markers (optional)
    }).addTo(map);

    // Emit summary + geometry to parent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control.on("routesfound", (e: any) => {
      const route = e.routes?.[0];
      if (!route || !onRouteDataChange) return;

      const distanceMeters = route.summary?.totalDistance ?? 0;
      const durationSeconds = route.summary?.totalTime ?? 0;
      const polyline: [number, number][] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        route.coordinates?.map((c: any) => [c.lat, c.lng]) ?? [];

      onRouteDataChange({ distanceMeters, durationSeconds, polyline });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control.on("routingerror", (err: any) => {
      console.warn("Routing error:", err);
    });

    return () => control.remove();
  }, [map, from, to, onRouteDataChange]);

  return null;
}

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
          center={p1}
          zoom={6} // ← start wider; route will auto fit
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            className="bright-tiles"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />

          {/* Your own markers */}
          <Marker position={p1}>
            <Popup>Sydney, Australia</Popup>
          </Marker>
          <Marker position={p2}>
            <Popup>Melbourne, Australia</Popup>
          </Marker>

          <Routing
            from={p1}
            to={p2}
            onRouteDataChange={(data) => {
              // bubble up to your ControlPanel if you want
              console.log("Route summary:", data);
            }}
          />
        </MapContainer>
      </div>
    </>
  );
}
