import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order?: number;
  city?: string;
  state?: string;
}

export interface PathData {
  id: string;
  title: string;
  description: string;
  creatorID: string;
  createdAt: Date;
  waypointCount: number;
  waypoints?: Waypoint[];
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

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Get user's routes -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function getUserRoutes(
  userId: string,
  limitCount: number = 6
): Promise<PathData[]> {
  try {
    console.log("Fetching routes for userId:", userId);
    const pathsRef = collection(db, "Paths");

    // Query with where clause only (orderBy requires composite index)
    // We'll sort in memory instead
    const q = query(
      pathsRef,
      where("creatorID", "==", userId),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    console.log("Found documents:", querySnapshot.size);
    const paths: PathData[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      console.log("Processing path:", docSnapshot.id, data);

      // Fetch waypoints for this path
      const waypointsRef = collection(
        doc(db, "Paths", docSnapshot.id),
        "waypoints"
      );
      const waypointsSnapshot = await getDocs(waypointsRef);
      const waypoints: Waypoint[] = waypointsSnapshot.docs.map(
        (wpDoc) =>
          ({
            id: wpDoc.id,
            ...wpDoc.data(),
          } as Waypoint)
      );

      // Sort waypoints by order
      waypoints.sort((a, b) => (a.order || 0) - (b.order || 0));

      paths.push({
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        creatorID: data.creatorID,
        createdAt: data.createdAt?.toDate() || new Date(),
        waypointCount: data.waypointCount,
        waypoints,
      });
    }

    // Sort by createdAt in memory (descending - newest first)
    paths.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log("Returning paths:", paths.length);
    return paths;
  } catch (error) {
    console.error("Error fetching user routes:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Get user's route count -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function getUserRouteCount(userId: string): Promise<number> {
  try {
    console.log("Fetching route count for userId:", userId);
    const pathsRef = collection(db, "Paths");
    const q = query(pathsRef, where("creatorID", "==", userId));

    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log("Route count:", count);
    return count;
  } catch (error) {
    console.error("Error fetching route count:", error);
    return 0; // Return 0 on error rather than throwing
  }
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Get all public routes -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function getAllRoutes(
  limitCount: number = 6
): Promise<PathData[]> {
  try {
    const pathsRef = collection(db, "Paths");
    const q = query(pathsRef, orderBy("createdAt", "desc"), limit(limitCount));

    const querySnapshot = await getDocs(q);
    const paths: PathData[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();

      // Fetch waypoints for this path
      const waypointsRef = collection(
        doc(db, "Paths", docSnapshot.id),
        "waypoints"
      );
      const waypointsSnapshot = await getDocs(waypointsRef);
      const waypoints: Waypoint[] = waypointsSnapshot.docs.map(
        (wpDoc) =>
          ({
            id: wpDoc.id,
            ...wpDoc.data(),
          } as Waypoint)
      );

      // Sort waypoints by order
      waypoints.sort((a, b) => (a.order || 0) - (b.order || 0));

      paths.push({
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        creatorID: data.creatorID,
        createdAt: data.createdAt?.toDate() || new Date(),
        waypointCount: data.waypointCount,
        waypoints,
      });
    }

    return paths;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
}
