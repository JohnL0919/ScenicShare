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
  limit,
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
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
  location?: string;
  isPublic?: boolean;
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Create a new route with waypoints -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 */
export async function createRoute(
  title: string,
  description: string,
  waypoints: Waypoint[],
  userId: string,
  imageUrl?: string,
  location?: string,
  isPublic: boolean = false
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
      location: location?.trim() || "",
      isPublic: isPublic,
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
        location: data.location || "",
        isPublic: data.isPublic || false,
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
  imageUrl?: string,
  location?: string,
  isPublic: boolean = false
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
        location: location?.trim() || "",
        isPublic: isPublic,
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
      location: data.location || "",
      isPublic: data.isPublic || false,
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
 * -=-=-=-=-=-=-=-=-=-=-=-=- Get all public routes (SCALABLE VERSION) -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 *
 * Performance optimizations:
 * 1. Uses Firestore orderBy with composite index (server-side sorting)
 * 2. Fetches only the requested number of routes (no over-fetching)
 * 3. Supports pagination with cursor-based approach
 * 4. Lazy-loads waypoints (only when needed, not in list view)
 *
 * @param limitCount - Number of routes to fetch (default: 6)
 * @param lastDoc - Last document from previous page (for pagination)
 * @returns Promise<{ routes: PathData[], lastDoc: QueryDocumentSnapshot | null }>
 */
export async function getAllRoutes(
  limitCount: number = 6,
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null
): Promise<{
  routes: PathData[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  try {
    const pathsRef = collection(db, "Paths");

    // Build query with server-side sorting and pagination
    // Note: This requires a composite index on (isPublic, createdAt)
    let q = query(
      pathsRef,
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    // If we have a cursor, start after it (pagination)
    if (lastDoc) {
      q = query(
        pathsRef,
        where("isPublic", "==", true),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const paths: PathData[] = [];

    // Process routes WITHOUT fetching waypoints (lazy loading)
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();

      paths.push({
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        creatorID: data.creatorID,
        createdAt: data.createdAt?.toDate() || new Date(),
        waypointCount: data.waypointCount,
        // Don't fetch waypoints here - they're loaded on-demand
        waypoints: undefined,
        imageUrl: data.imageUrl || "",
        location: data.location || "",
        isPublic: data.isPublic || false,
      });
    }

    // Return routes and pagination cursor
    const lastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return {
      routes: paths,
      lastDoc: lastVisible,
    };
  } catch (error) {
    console.error("Error fetching routes:", error);

    // If composite index doesn't exist, fall back to in-memory sorting
    if (error instanceof Error && error.message.includes("index")) {
      console.warn(
        "Composite index not found, falling back to in-memory sorting"
      );
      return getAllRoutesLegacy(limitCount);
    }

    throw error;
  }
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Legacy version (fallback without index) -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 * This is the old approach - kept as fallback if composite index isn't created yet
 */
async function getAllRoutesLegacy(
  limitCount: number = 6
): Promise<{ routes: PathData[]; lastDoc: null }> {
  const pathsRef = collection(db, "Paths");
  const q = query(pathsRef, where("isPublic", "==", true));

  const querySnapshot = await getDocs(q);
  const paths: PathData[] = [];

  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();

    paths.push({
      id: docSnapshot.id,
      title: data.title,
      description: data.description,
      creatorID: data.creatorID,
      createdAt: data.createdAt?.toDate() || new Date(),
      waypointCount: data.waypointCount,
      waypoints: undefined,
      imageUrl: data.imageUrl || "",
      location: data.location || "",
      isPublic: data.isPublic || false,
    });
  }

  // Sort by createdAt in memory (descending - newest first)
  paths.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    routes: paths.slice(0, limitCount),
    lastDoc: null, // No pagination support in legacy mode
  };
}

/**
 * -=-=-=-=-=-=-=-=-=-=-=-=- Fetch waypoints for a specific route -=-=-=-=-=-=-=-=--=-=-=-=--=-=-
 * Separated function for lazy loading waypoints when user clicks on a route
 */
export async function getRouteWaypoints(routeId: string): Promise<Waypoint[]> {
  try {
    const waypointsRef = collection(doc(db, "Paths", routeId), "waypoints");
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

    return waypoints;
  } catch (error) {
    console.error("Error fetching waypoints:", error);
    throw error;
  }
}
