import React from "react";
import Image from "next/image";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";

export default function FeaturedRoute() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto py-8">
      <h1 className="text-center mb-2">Featured Route</h1>
      <h4 className="text-center mb-6">
        This week&apos;s highlighted scenic drive, curated by our community
      </h4>
      <Card variant="outlined" sx={{ width: 320 }}>
        <CardOverflow>
          <AspectRatio ratio="2">
            <Image
              src="/scenic2.jpg"
              alt="The Grand Pacific Drive to Sea Cliff Bridge"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              style={{ objectFit: "cover" }}
              priority
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography level="title-md">Sea Cliff Bridge</Typography>
          <Typography level="body-sm">New South Wales, Australia</Typography>
        </CardContent>
        <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
          <Divider inset="context" />
          <CardContent orientation="horizontal">
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ fontWeight: "md" }}
            >
              6.3k views
            </Typography>
            <Divider orientation="vertical" />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ fontWeight: "md" }}
            >
              1 hour ago
            </Typography>
          </CardContent>
        </CardOverflow>
      </Card>
    </div>
  );
}
