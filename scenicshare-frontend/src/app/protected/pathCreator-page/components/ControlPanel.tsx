"use client";

import { useEffect, useState } from "react";
import Button from "./Button";

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}
interface ControlPanelProps {
  waypoints?: Waypoint[];
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border border-black/10 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1.5 bg-gray-50 hover:bg-gray-100"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-gray-800">{title}</span>
        <span className="text-gray-500">{open ? "▾" : "▸"}</span>
      </button>
      <div className={`${open ? "block" : "hidden"} p-2 bg-white`}>
        {children}
      </div>
    </section>
  );
};

export default function ControlPanel({
  waypoints = [],
  onWaypointsChange,
}: ControlPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newWaypointName, setNewWaypointName] = useState("");
  const [open, setOpen] = useState(false); // drawer visibility

  // Open by default on desktop (>=1024px), closed on mobile/tablet
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setOpen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const addWaypoint = () => {
    if (!newWaypointName.trim()) return;
    const wp: Waypoint = {
      id: Date.now().toString(),
      name: newWaypointName.trim(),
      lat: -33.8688 + (Math.random() - 0.5) * 0.1,
      lng: 151.2093 + (Math.random() - 0.5) * 0.1,
    };
    const updated = [...waypoints, wp];
    onWaypointsChange?.(updated);
    setNewWaypointName("");
  };

  const removeWaypoint = (id: string) => {
    const updated = waypoints.filter((w) => w.id !== id);
    onWaypointsChange?.(updated);
  };

  return (
    <>
      {/* Floating toggle button (opens/closes drawer) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="route-drawer"
        className="
          fixed bottom-4 right-4 z-[1003]
          rounded-full shadow-lg px-4 py-2
          bg-blue-600 text-white text-sm
          hover:bg-blue-700
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        "
      >
        {open ? "Close Route" : "Open Route"}
      </button>

      {/* Drawer (right sidebar) */}
      <aside
        id="route-drawer"
        className={`
          fixed top-1/2 -translate-y-1/2 right-[1rem] z-[1000] rounded-2xl
          w-[360px] md:w-[380px] lg:w-[360px]
          max-h-[80vh]
          bg-white/95 backdrop-blur border-l border-black/10 shadow-xl
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
          pt-4
          flex flex-col
        `}
        role="complementary"
        aria-label="Route creator panel"
      >
        <div className="p-4 space-y-3 overflow-y-auto h-full">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Create Your Route
          </h1>
          <h6 className="text-sm  text-gray-400 mb-7">
            Please drag the waypoints to choose your starting point and
            destination.
          </h6>
          <Section title="Details">
            <label className="block mb-2">
              <span className="block text-sm text-gray-700 mb-1">
                Route Title
              </span>
              <input
                type="text"
                className="w-full p-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter route title..."
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-700 mb-1">
                Description
              </span>
              <textarea
                rows={3}
                className="w-full p-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your route..."
              />
            </label>
          </Section>

          <Section title="Waypoints" defaultOpen>
            {waypoints.length > 0 ? (
              <ul className="space-y-2">
                {waypoints.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {w.name}
                      </p>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Lat:</span>{" "}
                          {w.lat.toFixed(5)}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Lng:</span>{" "}
                          {w.lng.toFixed(5)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeWaypoint(w.id)}
                      className="self-center px-3 py-2 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No waypoints yet.</p>
            )}
          </Section>

          <Button
            variant="primary"
            text="Save Route"
            onClick={() =>
              console.log("Saving route:", {
                title,
                description,
                waypoints,
              })
            }
          />
        </div>
      </aside>

      {/* Scrim on small screens when open */}
      <div
        className={`fixed inset-0 bg-black/30 z-[1001] lg:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
    </>
  );
}
