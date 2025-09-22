import * as React from "react";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { discoverRoutes } from "@/lib/mockData";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Image from "next/image";

export default function DiscoverRoute() {
  return (
    <div>
      <h1 className="text-center mb-2 text-3xl">Discover Routes </h1>
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
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
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
    </div>
  );
}
