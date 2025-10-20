import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order?: number;
  city?: string;
  state?: string;
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Create a new route with waypoints -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function createRoute(
  title: string,
  description: string,
  waypoints: Waypoint[],
  userId: string
): Promise<string> {
  try {
    // Create the main route document
    const pathsRef = collection(db, "Paths");
    const pathDoc = await addDoc(pathsRef, {
      title: title.trim(),
      description: description.trim(),
      creatorID: userId,
      createdAt: new Date(),
      waypointCount: waypoints.length,
    });

    // Save waypoints as a subcollection
    const waypointsRef = collection(pathDoc, "waypoints");
    const waypointPromises = waypoints.map(async (waypoint, index) => {
      const waypointData = {
        name: waypoint.name,
        lat: waypoint.lat,
        lng: waypoint.lng,
        order: index,
        creatorID: userId,
        city: waypoint.city || "",
        state: waypoint.state || "",
      };

      return setDoc(doc(waypointsRef, waypoint.id), waypointData);
    });

    await Promise.all(waypointPromises);

    return pathDoc.id;
  } catch (error) {
    console.error("Error creating route:", error);
    throw error;
  }
}
