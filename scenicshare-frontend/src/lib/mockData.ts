export interface FeaturedRouteData {
  id: string;
  name: string;
  image: string;
  location: string;
  duration: string;
  distance: string;
  description?: string;
}

export const featuredRoutes: FeaturedRouteData[] = [
  {
    id: "1",
    name: "Sea Cliff Bridge",
    image: "/scenic2.jpg",
    location: "New South Wales, Australia",
    duration: "2.5 hours",
    distance: "140 kilometers",
    description:
      "A breathtaking coastal drive featuring the iconic Sea Cliff Bridge",
  },
  {
    id: "2",
    name: "Great Ocean Road",
    image: "/scenic1.jpg",
    location: "Victoria, Australia",
    duration: "3 hours",
    distance: "243 kilometers",
    description:
      "Famous coastal drive with spectacular views of the Twelve Apostles",
  },
  {
    id: "3",
    name: "Blue Ridge Parkway",
    image: "/scenic1.jpg",
    location: "North Carolina, USA",
    duration: "4.5 hours",
    distance: "755 kilometers",
    description:
      "America's favorite scenic mountain drive through the Appalachians",
  },
  {
    id: "4",
    name: "Pacific Coast Highway",
    image: "/scenic2.jpg",
    location: "California, USA",
    duration: "5 hours",
    distance: "196 kilometers",
    description: "Stunning coastal views along the rugged California shoreline",
  },
];

export const currentFeaturedRoute = featuredRoutes[0];
