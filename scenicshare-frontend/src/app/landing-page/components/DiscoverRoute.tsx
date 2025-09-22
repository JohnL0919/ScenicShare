import * as React from "react";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import { discoverRoutes } from "@/lib/mockData";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhotoIcon from "@mui/icons-material/Photo";
import Image from "next/image";

// Map to assign difficulty levels to routes
const routeDifficulties: Record<string, string> = {
  "5": "Easy",
  "6": "Moderate",
  "7": "Easy",
  "8": "Moderate",
  "9": "Challenging",
  "10": "Easy",
};

// Map to assign photo counts to routes
const routePhotos: Record<string, number> = {
  "5": 127,
  "6": 203,
  "7": 94,
  "8": 167,
  "9": 73,
  "10": 145,
};

export default function DiscoverRoute() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {discoverRoutes.map((route) => (
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
                },
              }}
            >
              <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
                <Chip
                  variant="solid"
                  size="sm"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    borderRadius: "4px",
                  }}
                >
                  {routeDifficulties[route.id] || "Easy"}
                </Chip>
              </Box>
              <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                <Chip
                  variant="solid"
                  size="sm"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <PhotoIcon fontSize="small" />
                  {routePhotos[route.id] || "99"}
                </Chip>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  mt: "-1px",
                  mx: "-1px",
                  height: 200,
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <Image
                  src={route.image}
                  alt={route.name}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  priority={route.id === "5" || route.id === "6"}
                  quality={80}
                />
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography level="title-lg" sx={{ mb: 0.5 }}>
                  {route.name}
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
                  <Typography level="body-sm">{route.location}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography level="body-sm">{route.duration}</Typography>
                  </Box>
                  <Typography level="body-sm">{route.distance}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
