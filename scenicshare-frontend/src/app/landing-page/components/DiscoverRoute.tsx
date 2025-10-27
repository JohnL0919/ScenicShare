"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getAllRoutes, PathData } from "@/services/routes";

export default function DiscoverRoute() {
  const [routes, setRoutes] = React.useState<PathData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const fetchedRoutes = await getAllRoutes(6);
        setRoutes(fetchedRoutes);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Helper function to get location string from waypoints
  const getLocation = (route: PathData): string => {
    if (!route.waypoints || route.waypoints.length === 0) {
      return "Unknown location";
    }
    const first = route.waypoints[0];
    const last = route.waypoints[route.waypoints.length - 1];

    if (first.city && first.state) {
      if (route.waypoints.length === 1) {
        return `${first.city}, ${first.state}`;
      }
      return `${first.city} to ${last.city || last.name}`;
    }

    return first.name;
  };

  // Helper function to calculate approximate distance
  const calculateDistance = (route: PathData): string => {
    if (!route.waypoints || route.waypoints.length < 2) {
      return "N/A";
    }

    // Calculate total distance between consecutive waypoints
    let totalDistance = 0;
    for (let i = 0; i < route.waypoints.length - 1; i++) {
      const wp1 = route.waypoints[i];
      const wp2 = route.waypoints[i + 1];

      // Haversine formula for distance calculation
      const R = 6371; // Earth's radius in km
      const dLat = ((wp2.lat - wp1.lat) * Math.PI) / 180;
      const dLng = ((wp2.lng - wp1.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((wp1.lat * Math.PI) / 180) *
          Math.cos((wp2.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }

    return `${Math.round(totalDistance)} km`;
  };

  // Helper function to estimate duration
  const estimateDuration = (route: PathData): string => {
    if (!route.waypoints || route.waypoints.length < 2) {
      return "N/A";
    }

    const distance = parseFloat(calculateDistance(route));
    // Assume average speed of 50 km/h for scenic routes
    const hours = distance / 50;

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
        <div className="flex justify-center items-center h-64">
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
                  <img
                    src={getRouteImage(route)}
                    alt={route.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/scenic1.jpg";
                    }}
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
