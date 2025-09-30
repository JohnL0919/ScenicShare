"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

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
    <div className="px-4 sm:px-6 lg:px-8 text-left mt-24 sm:mt-28 lg:mt-32 w-full sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto lg:mx-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        Welcome Back, {userName}
      </h1>
      <h5 className="my-3 sm:my-5 text-sm sm:text-base">
        Explore breathtaking routes curated by fellow adventurers. Your next
        journey awaits.
      </h5>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full"></div>
    </div>
  );
}
