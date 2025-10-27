"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContexts";
import { createRoute } from "@/services/routes";

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

const STOCK_IMAGES = [
  "/scenic1.jpg",
  "/scenic2.jpg",
  "/scenic3.jpg",
  "/scenic4.jpg",
  "/scenic5.jpg",
  "/scenic6.jpg",
  "/scenic7.jpg",
  "/scenic8.jpg",
];

export default function ControlPanel({
  waypoints = [],
  onWaypointsChange,
}: ControlPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [imageSource, setImageSource] = useState<"stock" | "custom">("stock");
  const [open, setOpen] = useState(false); // drawer visibility
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { currentUser } = useAuth();

  // Open by default on desktop (>=1024px), closed on mobile/tablet
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setOpen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const removeWaypoint = (id: string) => {
    const updated = waypoints.filter((w) => w.id !== id);
    onWaypointsChange?.(updated);
  };

  const saveRoute = async () => {
    // Validation
    if (!title.trim()) {
      setSaveMessage({ type: "error", text: "Please enter a route title" });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    if (waypoints.length < 2) {
      setSaveMessage({
        type: "error",
        text: "Please add at least 2 waypoints",
      });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    if (!currentUser?.uid) {
      setSaveMessage({ type: "error", text: "You must be logged in" });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      // Determine which image to save
      const imageToSave =
        imageSource === "custom" ? customImageUrl : selectedImage;

      const routeId = await createRoute(
        title,
        description,
        waypoints,
        currentUser.uid,
        imageToSave,
        location
      );

      console.log("✅ Route saved successfully with ID:", routeId);

      setSaveMessage({
        type: "success",
        text: "Route saved successfully!",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("❌ Error saving route:", error);
      setSaveMessage({
        type: "error",
        text: "Failed to save route. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
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

            <label className="block mb-2">
              <span className="block text-sm text-gray-700 mb-1">
                Location / Suburb
              </span>
              <input
                type="text"
                className="w-full p-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Sydney, NSW"
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

          <Section title="Cover Image" defaultOpen>
            <div className="space-y-3">
              {/* Image source selector */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageSource("stock")}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    imageSource === "stock"
                      ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Stock Images
                </button>
                <button
                  type="button"
                  onClick={() => setImageSource("custom")}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    imageSource === "custom"
                      ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Custom URL
                </button>
              </div>

              {imageSource === "stock" ? (
                <div className="grid grid-cols-2 gap-2">
                  {STOCK_IMAGES.map((imgUrl) => (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImage === imgUrl
                          ? "border-blue-500 ring-2 ring-blue-300"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="Stock scenic"
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === imgUrl && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white drop-shadow-lg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block">
                    <span className="block text-sm text-gray-700 mb-1">
                      Image URL
                    </span>
                    <input
                      type="url"
                      className="w-full p-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </label>
                  {customImageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={customImageUrl}
                        alt="Preview"
                        className="w-full aspect-video object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
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

          {saveMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
                saveMessage.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {saveMessage.type === "success" ? (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{saveMessage.text}</span>
            </div>
          )}

          <button
            onClick={saveRoute}
            disabled={saving}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm
              transform transition-all duration-200 ease-out shadow-sm
              ${
                saving
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }
            `}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving Route...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>Save Route</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
