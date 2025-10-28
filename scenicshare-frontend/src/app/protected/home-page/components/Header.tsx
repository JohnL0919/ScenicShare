"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import StatsDisplay from "./StatsDisplay";
import Link from "next/link";

export default function Header() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setDisplayName(user.displayName);
      } else {
        setEmail(null);
        setDisplayName(null);
      }
    });

    return () => unsubscribe();
  }, []);
  /**This component sets up a Firebase Auth subscription inside a useEffect that runs once on mount. We call onAuthStateChanged(auth, (user) => { ... }).
   * Firebase immediately invokes that callback with the current auth state—either a user object or null.
   * If there’s a user, we store user.email and user.displayName in React state; if not, we clear them.
   * Updating state triggers a re-render so the greeting shows the right name. The same callback runs
   * whenever auth changes—sign in, sign out, or token refresh—so the UI stays in sync.
   * onAuthStateChanged returns an unsubscribe function, which we return from useEffect to clean up the listener when the component unmounts and avoid memory leaks. */

  // Get the name to display in the welcome message
  const userName = displayName || email?.split("@")[0] || "Explorer";

  return (
    <div className="px-4 sm:px-6 lg:px-8 text-left mt-24 sm:mt-28 lg:mt-32 w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        Welcome Back,
      </h1>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        {userName}
      </h1>
      <h5 className="my-3 sm:my-5 text-sm sm:text-base">
        Ready for your next scenic adventure? Explore routes or create your own.
      </h5>

      {/* Create Route Button */}
      <Link
        href="/protected/pathCreator-page"
        className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-green-900 hover:bg-green-800 text-white rounded-lg transition-all duration-200 font-medium text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Create New Route
      </Link>

      <div className="mt-6">
        <StatsDisplay />
      </div>
    </div>
  );
}
