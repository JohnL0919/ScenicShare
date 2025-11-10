import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

/**
 * Check if user has granted location permission
 */
export async function checkLocationPermission(
  userId: string
): Promise<boolean> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data?.locationPermissionGranted === true;
    }

    return false;
  } catch (error) {
    console.error("Error checking location permission:", error);
    return false;
  }
}

/**
 * Update user's location permission status in Firestore
 */
export async function updateLocationPermission(
  userId: string,
  granted: boolean
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        locationPermissionGranted: granted,
        locationPermissionUpdatedAt: new Date().toISOString(),
      });
    } else {
      // Create new document if it doesn't exist
      await setDoc(userDocRef, {
        locationPermissionGranted: granted,
        locationPermissionUpdatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error updating location permission:", error);
    throw error;
  }
}

/**
 * Request browser location permission and update Firestore
 */
export async function requestLocationPermission(
  userId: string
): Promise<boolean> {
  try {
    // Request browser geolocation permission
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      }
    );

    // If successful, update Firestore
    if (position) {
      await updateLocationPermission(userId, true);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
}
