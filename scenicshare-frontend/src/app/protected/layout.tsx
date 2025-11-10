"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContexts";
import {
  checkLocationPermission,
  updateLocationPermission,
  requestLocationPermission,
} from "@/lib/firebase/location";
import toast from "react-hot-toast";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Check location permission when user logs in
  useEffect(() => {
    const checkPermission = async () => {
      if (!currentUser?.uid || isChecking) return;

      setIsChecking(true);

      try {
        const hasPermission = await checkLocationPermission(currentUser.uid);

        // Show modal if permission is not granted
        if (!hasPermission) {
          setShowLocationModal(true);
        }
      } catch (error) {
        console.error("Error checking location permission:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkPermission();
  }, [currentUser?.uid]);

  const handleAllowLocation = async () => {
    if (!currentUser?.uid) return;

    try {
      // Request browser location and update Firestore
      const granted = await requestLocationPermission(currentUser.uid);

      if (granted) {
        toast.success("Location access granted!");
      } else {
        toast.error("Location access denied by browser");
        // Still update Firestore to record the attempt
        await updateLocationPermission(currentUser.uid, false);
      }
      setShowLocationModal(false);
    } catch (error) {
      console.error("Error granting location permission:", error);
      toast.error("Failed to update location permission");
      setShowLocationModal(false);
    }
  };

  const handleDenyLocation = async () => {
    if (!currentUser?.uid) return;

    try {
      // Update Firestore to record denial
      await updateLocationPermission(currentUser.uid, false);
      setShowLocationModal(false);
      toast("You can enable location access later from settings", {
        icon: "ℹ️",
      });
    } catch (error) {
      console.error("Error denying location permission:", error);
      setShowLocationModal(false);
    }
  };

  return (
    <ProtectedRoute>
      {children}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />
    </ProtectedRoute>
  );
}
