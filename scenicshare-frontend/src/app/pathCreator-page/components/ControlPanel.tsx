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
  onRouteDataChange?: (data: {
    title: string;
    description: string;
    waypoints: Waypoint[];
  }) => void;
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
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-gray-800">{title}</span>
        <span className="text-gray-500">{open ? "▾" : "▸"}</span>
      </button>
      <div className={`${open ? "block" : "hidden"} p-3 bg-white`}>
        {children}
      </div>
    </section>
  );
};

export default function ControlPanel({ onRouteDataChange }: ControlPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
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

  const sync = (wps = waypoints, t = title, d = description) =>
    onRouteDataChange?.({ title: t, description: d, waypoints: wps });

  const addWaypoint = () => {
    if (!newWaypointName.trim()) return;
    const wp: Waypoint = {
      id: Date.now().toString(),
      name: newWaypointName.trim(),
      lat: -33.8688 + (Math.random() - 0.5) * 0.1,
      lng: 151.2093 + (Math.random() - 0.5) * 0.1,
    };
    const updated = [...waypoints, wp];
    setWaypoints(updated);
    setNewWaypointName("");
    sync(updated);
  };

  const removeWaypoint = (id: string) => {
    const updated = waypoints.filter((w) => w.id !== id);
    setWaypoints(updated);
    sync(updated);
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
          rounded-full shadow-lg px-4 py-3
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
          fixed top-[1rem] right-[1rem] z-[1000] rounded-2xl
          w-[360px] md:w-[380px] lg:w-[360px]
          bg-white/95 backdrop-blur border-l border-black/10 shadow-xl
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
          pt-4
        `}
        role="complementary"
        aria-label="Route creator panel"
      >
        <div className="p-4 space-y-3 overflow-y-auto ">
          <Section title="Details">
            <label className="block mb-3">
              <span className="block text-sm text-gray-700 mb-1">
                Route Title
              </span>
              <input
                type="text"
                className="w-full p-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  sync(waypoints, e.target.value, description);
                }}
                placeholder="Enter route title..."
              />
            </label>

            <label className="block">
              <span className="block text-sm text-gray-700 mb-1">
                Description
              </span>
              <textarea
                rows={4}
                className="w-full p-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  sync(waypoints, title, e.target.value);
                }}
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
                      <p className="text-sm font-medium">{w.name}</p>
                      <p className="text-xs text-gray-500">
                        {w.lat.toFixed(5)}, {w.lng.toFixed(5)}
                      </p>
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

            <div className="mt-3 flex gap-2 max-lg:flex-col">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 text-gray-600 rounded-lg"
                value={newWaypointName}
                onChange={(e) => setNewWaypointName(e.target.value)}
                placeholder="Add waypoint..."
                onKeyDown={(e) => e.key === "Enter" && addWaypoint()}
              />
              <button
                onClick={addWaypoint}
                className="px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                Add
              </button>
            </div>
          </Section>

          <Section title="Actions" defaultOpen>
            <div className="flex gap-3 max-lg:flex-col">
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
              <Button
                variant="secondary"
                text="Clear All"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setWaypoints([]);
                  sync([]);
                }}
              />
            </div>
          </Section>
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
