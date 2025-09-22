"use client";

import React from "react";
import Image from "next/image";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import { featuredRoutes, FeaturedRouteData } from "@/lib/mockData";

interface FeaturedRouteProps {
  routeId?: string;
  randomize?: boolean;
}

export default function FeaturedRoute({
  routeId,
  randomize = false,
}: FeaturedRouteProps) {
  // Select the route based on props
  const route: FeaturedRouteData = React.useMemo(() => {
    // If randomize is true, pick a random route
    if (randomize) {
      const randomIndex = Math.floor(Math.random() * featuredRoutes.length);
      return featuredRoutes[randomIndex];
    }

    // If routeId is provided, find that specific route
    if (routeId) {
      const foundRoute = featuredRoutes.find((r) => r.id === routeId);
      if (foundRoute) return foundRoute;
    }

    // Default to first route
    return featuredRoutes[0];
  }, [routeId, randomize]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full sm:max-w-lg md:max-w-xl mx-auto py-8 px-4">
      <h1 className="text-center mb-2 text-3xl">Featured Route</h1>
      <h4 className="text-center mb-6">
        This week&apos;s highlighted scenic drive, curated by our community
      </h4>
      <Card
        variant="outlined"
        sx={{
          width: "90%",
          maxWidth: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardOverflow>
          <AspectRatio ratio="2">
            <Image
              src={route.image}
              alt={`Scenic route: ${route.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
              }}
              priority
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent sx={{ padding: "16px", textAlign: "left" }}>
          <Typography level="title-md" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {route.name}
          </Typography>

          {/* Location with icon */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
            <Typography level="body-sm" sx={{ color: "text.secondary" }}>
              {route.location}
            </Typography>
          </Box>

          {route.description && (
            <Typography level="body-sm" sx={{ mb: 1.5 }}>
              {route.description}
            </Typography>
          )}
        </CardContent>
        <CardOverflow
          variant="soft"
          sx={{
            bgcolor: "background.level1",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s ease",
          }}
        >
          <Divider inset="context" />
          <CardContent
            orientation="horizontal"
            sx={{ justifyContent: "space-between" }}
          >
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{
                fontWeight: "md",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
              {route.duration}
            </Typography>
            <Divider orientation="vertical" />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{
                fontWeight: "md",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              {route.distance}
            </Typography>
          </CardContent>
        </CardOverflow>
      </Card>
    </div>
  );
}
