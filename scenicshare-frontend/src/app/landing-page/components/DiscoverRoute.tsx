"use client";

import * as React from "react";
import Image from "next/image";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getAllRoutes, PathData } from "@/services/routes";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export default function DiscoverRoute() {
  const [routes, setRoutes] = React.useState<PathData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastDoc, setLastDoc] =
    React.useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { routes: fetchedRoutes, lastDoc: newLastDoc } =
          await getAllRoutes(6);
        setRoutes(fetchedRoutes);
        setLastDoc(newLastDoc);
        setHasMore(fetchedRoutes.length === 6); // If we got less than requested, no more pages
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Function to load more routes (for future "Load More" button)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { routes: moreRoutes, lastDoc: newLastDoc } = await getAllRoutes(
        6,
        lastDoc
      );
      setRoutes((prev) => [...prev, ...moreRoutes]);
      setLastDoc(newLastDoc);
      setHasMore(moreRoutes.length === 6);
    } catch (error) {
      console.error("Error loading more routes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get location string
  const getLocation = (route: PathData): string => {
    // Always use the saved location field (no waypoint dependency)
    if (route.location) {
      return route.location;
    }

    return "Unknown location";
  };

  // Helper function to calculate approximate distance
  // Note: Uses waypoint count as proxy since waypoints are lazy-loaded
  const calculateDistance = (route: PathData): string => {
    // With lazy loading, we estimate based on waypoint count
    // Alternative: could store pre-calculated distance in route document
    if (route.waypointCount < 2) {
      return "N/A";
    }

    // Estimate ~20km per waypoint segment (rough average for scenic routes)
    const estimatedDistance = (route.waypointCount - 1) * 20;
    return `~${estimatedDistance} km`;
  };

  // Helper function to estimate duration
  const estimateDuration = (route: PathData): string => {
    if (route.waypointCount < 2) {
      return "N/A";
    }

    const estimatedDistance = (route.waypointCount - 1) * 20;
    // Assume average speed of 50 km/h for scenic routes
    const hours = estimatedDistance / 50;

    if (hours < 1) {
      return `${Math.round(hours * 60)} mins`;
    }
    return `${hours.toFixed(1)} hours`;
  };

  // Helper function to get route image
  const getRouteImage = (route: PathData): string => {
    // Use saved image if available
    if (route.imageUrl) {
      return route.imageUrl;
    }

    // Fallback to a default scenic image
    return "/scenic1.jpg";
  };

  if (loading) {
    return (
      <div className="mt-8 px-4 md:px-8 lg:px-16">
        <h1 className="text-center mb-2 text-3xl">Discover Routes</h1>
        <div className="flex justify-center items-center h-64">
          <Typography level="body-lg">Loading routes...</Typography>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="mt-8 px-4 md:px-8 lg:px-16">
        <h1 className="text-center mb-2 text-3xl">Discover Routes</h1>
        <div className="flex justify-center items-center h-64 text-white">
          <Typography level="body-lg">
            No routes available yet. Create the first one!
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 md:px-8 lg:px-16">
      <h1 className="text-center mb-2 text-3xl">Discover Routes</h1>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {routes.map((route) => (
            <Grid xs={12} sm={6} md={4} key={route.id}>
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  bgcolor: "white",
                  color: "text.primary",
                  overflow: "hidden",
                  borderRadius: "8px",
                  p: 0,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    transform: "scale(1.02)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    overflow: "hidden",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    bgcolor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={getRouteImage(route)}
                    alt={route.title}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                  />
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography level="title-lg" sx={{ mb: 0.5 }}>
                    {route.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                    <Typography level="body-sm">
                      {getLocation(route)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon fontSize="small" />
                      <Typography level="body-sm">
                        {estimateDuration(route)}
                      </Typography>
                    </Box>
                    <Typography level="body-sm">
                      {calculateDistance(route)}
                    </Typography>
                  </Box>
                  <Typography
                    level="body-xs"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {route.waypointCount} waypoint
                    {route.waypointCount !== 1 ? "s" : ""}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
