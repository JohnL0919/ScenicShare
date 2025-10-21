"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import { getUserRoutes, PathData } from "@/services/routes";
import { useAuth } from "@/contexts/authContexts";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteIcon from "@mui/icons-material/Route";

export default function YourRoute() {
  const { currentUser } = useAuth();
  const [routes, setRoutes] = useState<PathData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      console.log("Current user:", currentUser);
      if (!currentUser?.uid) {
        console.log("No user ID available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching routes for user:", currentUser.uid);
        const fetchedRoutes = await getUserRoutes(currentUser.uid, 6);
        console.log("Fetched routes:", fetchedRoutes);
        setRoutes(fetchedRoutes);
        setError(null);
      } catch (err) {
        console.error("Error fetching routes:", err);
        const error = err as { code?: string; message?: string };
        console.error("Error code:", error?.code);
        console.error("Error message:", error?.message);

        // Provide more specific error messages
        let errorMessage = "Failed to load your routes";
        if (error?.code === "permission-denied") {
          errorMessage = "Permission denied. Please check Firestore rules.";
        } else if (error?.code === "failed-precondition") {
          errorMessage = "Database index required. Check console for details.";
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="mt-8 px-4 md:px-8 lg:px-16 flex justify-center items-center min-h-[400px]">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 px-4 md:px-8 lg:px-16">
        <Typography level="body-lg" color="danger" className="text-center">
          {error}
        </Typography>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="mt-8 px-4 md:px-8 lg:px-16">
        <Typography level="body-lg" className="text-center text-gray-500">
          You haven&apos;t created any routes yet. Start creating your first
          scenic route!
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 md:px-8 lg:px-16">
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {routes.map((route) => {
            const firstWaypoint = route.waypoints?.[0];
            const location = firstWaypoint
              ? `${firstWaypoint.city || ""}${
                  firstWaypoint.city && firstWaypoint.state ? ", " : ""
                }${firstWaypoint.state || ""}`
              : "Location not set";

            return (
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
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
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
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RouteIcon
                      sx={{ fontSize: 64, color: "white", opacity: 0.7 }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography level="title-lg" sx={{ mb: 0.5 }}>
                      {route.title}
                    </Typography>
                    {route.description && (
                      <Typography
                        level="body-sm"
                        sx={{ mb: 1, color: "text.secondary" }}
                      >
                        {route.description.length > 80
                          ? `${route.description.substring(0, 80)}...`
                          : route.description}
                      </Typography>
                    )}
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
                        {location || "No location"}
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
                        <RouteIcon fontSize="small" />
                        <Typography level="body-sm">
                          {route.waypointCount}{" "}
                          {route.waypointCount === 1 ? "waypoint" : "waypoints"}
                        </Typography>
                      </Box>
                      <Typography
                        level="body-sm"
                        sx={{ color: "text.secondary" }}
                      >
                        {new Date(route.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </div>
  );
}
