import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
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
  imageUrl?: string;
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Create a new route with waypoints -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function createRoute(
  title: string,
  description: string,
  waypoints: Waypoint[],
  userId: string,
  imageUrl?: string
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
      imageUrl: imageUrl || "",
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
        imageUrl: data.imageUrl || "",
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
 * -=-=-=-=-=-=-=-=-=-=-=-=- Update an existing route with waypoints -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function updateRoute(
  pathId: string,
  title: string,
  description: string,
  waypoints: Waypoint[],
  userId: string,
  imageUrl?: string
): Promise<void> {
  try {
    console.log("Updating route:", pathId);

    // Update the main route document
    const pathRef = doc(db, "Paths", pathId);
    await setDoc(
      pathRef,
      {
        title: title.trim(),
        description: description.trim(),
        waypointCount: waypoints.length,
        imageUrl: imageUrl || "",
      },
      { merge: true }
    );

    // Delete all existing waypoints
    const waypointsRef = collection(pathRef, "waypoints");
    const existingWaypoints = await getDocs(waypointsRef);
    const deletePromises = existingWaypoints.docs.map((wpDoc) =>
      deleteDoc(doc(db, "Paths", pathId, "waypoints", wpDoc.id))
    );
    await Promise.all(deletePromises);

    // Add updated waypoints
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
    console.log("Route updated successfully");
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Get a single route by ID -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function getRouteById(pathId: string): Promise<PathData | null> {
  try {
    console.log("Fetching route:", pathId);
    const pathRef = doc(db, "Paths", pathId);
    const pathSnapshot = await getDoc(pathRef);

    if (!pathSnapshot.exists()) {
      console.log("Route not found");
      return null;
    }

    const data = pathSnapshot.data();

    // Fetch waypoints
    const waypointsRef = collection(pathRef, "waypoints");
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

    return {
      id: pathSnapshot.id,
      title: data.title,
      description: data.description,
      creatorID: data.creatorID,
      createdAt: data.createdAt?.toDate() || new Date(),
      waypointCount: data.waypointCount,
      waypoints,
      imageUrl: data.imageUrl || "",
    };
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Delete a route and all its waypoints -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function deleteRoute(
  pathId: string,
  userId: string
): Promise<void> {
  try {
    console.log("Deleting route:", pathId, "for user:", userId);

    // First, delete all waypoints in the subcollection
    const waypointsRef = collection(doc(db, "Paths", pathId), "waypoints");
    const waypointsSnapshot = await getDocs(waypointsRef);

    const deleteWaypointPromises = waypointsSnapshot.docs.map((wpDoc) =>
      deleteDoc(doc(db, "Paths", pathId, "waypoints", wpDoc.id))
    );

    await Promise.all(deleteWaypointPromises);
    console.log(`Deleted ${waypointsSnapshot.size} waypoints`);

    // Then delete the main path document
    await deleteDoc(doc(db, "Paths", pathId));
    console.log("Route deleted successfully");
  } catch (error) {
    console.error("Error deleting route:", error);
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
        imageUrl: data.imageUrl || "",
      });
    }

    return paths;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
}
