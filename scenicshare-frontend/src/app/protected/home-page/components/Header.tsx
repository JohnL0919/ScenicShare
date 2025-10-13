"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebase";
import StatsDisplay from "./StatsDisplay";
import Button from "@/app/protected/home-page/components/Button";

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
    <div className="grid grid-cols-2 px-4 sm:px-6 lg:px-8 w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto mt-20 sm:mt-28 lg:mt-32">
      {/* Left column - Welcome text */}
      <div className="flex flex-col">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl mt-3">
          Welcome Back,
          <br />
        </h1>
        <h1 className=" text-3xl sm:text-4xl md:text-5xl lg:text-4xl mt-3">
          {userName}
        </h1>
        <h2 className="text-4xl  mb-6 mt-[20rem]">
          Ready for your next <br />
          scenic adventure?
        </h2>
        <div className=" w-64">
          <Button
            variant="primary"
            href="/protected/pathCreator-page"
            text={
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create New Path
              </div>
            }
          />
        </div>
      </div>

      {/* Right column - Stats */}
      <div>
        <StatsDisplay />
      </div>
    </div>
  );
}
