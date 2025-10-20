"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContexts";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, userLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !userLoggedIn && !hasRedirected) {
      // Save current path for redirect after login
      const returnUrl = encodeURIComponent(pathname);
      console.log(
        "[ProtectedRoute] Redirecting to login, returnUrl:",
        pathname
      );

      // Redirect to login page with return URL
      router.push(`/login-page?returnUrl=${returnUrl}`);
      setHasRedirected(true);
    }
  }, [loading, userLoggedIn, router, pathname, hasRedirected]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (redirect is happening)
  if (!userLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
