"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Button from "@mui/joy/Button";
import { getUserRoutes, PathData, deleteRoute } from "@/services/routes";
import { useAuth } from "@/contexts/authContexts";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteIcon from "@mui/icons-material/Route";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavigationIcon from "@mui/icons-material/Navigation";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import {
  checkLocationPermission,
  requestLocationPermission,
} from "@/lib/firebase/location";
import toast from "react-hot-toast";
import LocationPermissionModal from "@/components/LocationPermissionModal";

export default function YourRoute() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [routes, setRoutes] = useState<PathData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<PathData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<PathData | null>(null);

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

  const handleDeleteClick = (route: PathData, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setRouteToDelete(route);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!routeToDelete || !currentUser?.uid) return;

    setDeleting(true);
    try {
      await deleteRoute(routeToDelete.id, currentUser.uid);

      // Remove the route from local state
      setRoutes((prevRoutes) =>
        prevRoutes.filter((r) => r.id !== routeToDelete.id)
      );

      setDeleteModalOpen(false);
      setRouteToDelete(null);
    } catch (err) {
      console.error("Error deleting route:", err);
      const error = err as { message?: string };
      alert(error?.message || "Failed to delete route. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setRouteToDelete(null);
  };

  const getRouteImage = (route: PathData): string => {
    // Use saved image if available
    if (route.imageUrl) {
      return route.imageUrl;
    }

    // Fallback to a default scenic image
    return "/scenic1.jpg";
  };

  const generateGoogleMapsUrl = (
    route: PathData,
    userLocation?: { lat: number; lng: number }
  ): string => {
    if (!route.waypoints || route.waypoints.length < 2) {
      return "";
    }

    // Use user's current location as origin if available, otherwise use first waypoint
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : `${route.waypoints[0].lat},${route.waypoints[0].lng}`;

    const endWaypoint = route.waypoints[route.waypoints.length - 1];
    const destination = `${endWaypoint.lat},${endWaypoint.lng}`;

    // Include all waypoints if using user location, otherwise skip first waypoint
    const waypointsToUse = userLocation
      ? route.waypoints
      : route.waypoints.slice(1, -1);

    if (waypointsToUse.length > 0) {
      const intermediateWaypoints = waypointsToUse
        .slice(0, -1) // Exclude last waypoint (destination)
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join("|");

      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${intermediateWaypoints}&travelmode=driving`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  const handleRouteClick = async (route: PathData) => {
    if (!currentUser?.uid) {
      toast.error("You must be logged in to start navigation");
      return;
    }

    try {
      // Check location permission first
      const hasPermission = await checkLocationPermission(currentUser.uid);

      if (!hasPermission) {
        // Show location permission modal
        setPendingRoute(route);
        setShowLocationModal(true);
        return;
      }

      // Get user's current location
      let userLocation: { lat: number; lng: number } | undefined;
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          }
        );
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (error) {
        console.error("Could not get current location:", error);
        // Continue without user location - will use first waypoint
      }

      // Proceed with navigation
      const mapsUrl = generateGoogleMapsUrl(route, userLocation);
      if (mapsUrl) {
        window.open(mapsUrl, "_blank");
      } else {
        toast.error(
          "This route needs at least 2 waypoints to start navigation."
        );
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      toast.error("Failed to check location permission");
    }
  };

  const handleAllowLocation = async () => {
    if (!currentUser?.uid || !pendingRoute) return;

    try {
      const granted = await requestLocationPermission(currentUser.uid);

      if (granted) {
        toast.success("Location access granted!");
        setShowLocationModal(false);

        // Get user's current location
        let userLocation: { lat: number; lng: number } | undefined;
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              });
            }
          );
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (error) {
          console.error("Could not get current location:", error);
        }

        // Now start navigation with the pending route and user location
        const mapsUrl = generateGoogleMapsUrl(pendingRoute, userLocation);
        if (mapsUrl) {
          window.open(mapsUrl, "_blank");
        }
        setPendingRoute(null);
      } else {
        toast.error("Location access denied by browser");
        setShowLocationModal(false);
        setPendingRoute(null);
      }
    } catch (error) {
      console.error("Error granting location permission:", error);
      toast.error("Failed to update location permission");
    }
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
    setPendingRoute(null);
    toast("Location access is required for navigation", { icon: "ℹ️" });
  };

  if (loading) {
    return (
      <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto mt-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[400px]">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <Typography level="body-lg" color="danger" className="text-center">
          {error}
        </Typography>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <Typography
          level="body-lg"
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          You haven&apos;t created any routes yet. Start creating your first
          scenic route!
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[90%] xl:w-[90%] mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {routes.map((route) => {
            // Use saved location or fall back to waypoint-based location
            const location =
              route.location ||
              (() => {
                const firstWaypoint = route.waypoints?.[0];
                return firstWaypoint
                  ? `${firstWaypoint.city || ""}${
                      firstWaypoint.city && firstWaypoint.state ? ", " : ""
                    }${firstWaypoint.state || ""}`
                  : "Location not set";
              })();

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
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                      "& .delete-button, & .edit-button": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Edit Button */}
                  <IconButton
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/protected/pathEditor-page?id=${route.id}`);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 48,
                      zIndex: 10,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      "&:hover": {
                        bgcolor: "white",
                        color: "green",
                      },
                    }}
                    size="sm"
                  >
                    <EditIcon />
                  </IconButton>
                  {/* Delete Button */}
                  <IconButton
                    className="delete-button"
                    onClick={(e) => handleDeleteClick(route, e)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      "&:hover": {
                        bgcolor: "white",
                        color: "red",
                      },
                    }}
                    size="sm"
                  >
                    <DeleteIcon />
                  </IconButton>
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
                    {/* Public/Private Indicator Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        bgcolor: route.isPublic
                          ? "rgba(34, 197, 94, 0.95)"
                          : "rgba(34, 197, 94, 0.95)",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {route.isPublic ? (
                        <>
                          <PublicIcon sx={{ fontSize: "0.875rem" }} />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <LockIcon sx={{ fontSize: "0.875rem" }} />
                          <span>Private</span>
                        </>
                      )}
                    </Box>
                  </Box>
                  <CardContent
                    sx={{
                      p: 2,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
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
                        mb: 2,
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

                    {/* Start Navigation Button */}
                    <Button
                      variant="solid"
                      color="primary"
                      startDecorator={<NavigationIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRouteClick(route);
                      }}
                      sx={{
                        mt: "auto",
                        width: "100%",
                        bgcolor: "green",
                        "&:hover": {
                          bgcolor: "darkgreen",
                        },
                      }}
                    >
                      Start Navigation
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={handleDeleteCancel}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose />
          <Typography level="h4" sx={{ mb: 1 }}>
            Delete Route
          </Typography>
          <Typography level="body-md" sx={{ mb: 3 }}>
            Are you sure you want to delete &quot;{routeToDelete?.title}&quot;?
            This action cannot be undone and will delete all waypoints
            associated with this route.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleDeleteCancel}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleDeleteConfirm}
              loading={deleting}
            >
              Delete Route
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />
    </div>
  );
}
