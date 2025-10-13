import { auth } from "@/lib/firebase/firebase";
import { useEffect, useState, useContext, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Token refresh mechanism
  useEffect(() => {
    let refreshInterval;

    const setupTokenRefresh = (user) => {
      if (user) {
        // Refresh token every 50 minutes (before 1-hour expiry)
        refreshInterval = setInterval(async () => {
          try {
            const newToken = await user.getIdToken(true); // Force refresh
            const isProduction = window.location.protocol === "https:";
            const secureFlag = isProduction ? "secure;" : "";
            document.cookie = `__session=${newToken}; path=/; ${secureFlag} samesite=strict; max-age=${
              60 * 60
            }`;
            console.log("Token refreshed successfully");
          } catch (error) {
            console.error("Token refresh error:", error);
          }
        }, 50 * 60 * 1000); // 50 minutes
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      initializeUser(user);
      setupTokenRefresh(user);
    });

    return () => {
      unsubscribe();
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);

      // Set session cookie for middleware
      try {
        const idToken = await user.getIdToken();

        // Determine if we're in production (HTTPS) or development (HTTP)
        const isProduction = window.location.protocol === "https:";
        const secureFlag = isProduction ? "secure;" : "";

        // Set session cookie with appropriate security flags
        // Token expires in 1 hour, but we set cookie for 1 hour to match
        document.cookie = `__session=${idToken}; path=/; ${secureFlag} samesite=strict; max-age=${
          60 * 60
        }`;

        console.log("Session cookie set successfully");
      } catch (error) {
        console.error("Error setting session cookie:", error);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);

      // Clear session cookie
      document.cookie =
        "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setLoading(false);
  }

  // Logout function
  const logout = async () => {
    try {
      await auth.signOut();
      // Clear session cookie
      document.cookie =
        "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Export a hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
