export interface ScenicRouteData {
  id: string;
  name: string;
  image: string;
  location: string;
  duration: string;
  distance: string;
  description?: string;
}

export const scenicRouteMockData: ScenicRouteData[] = [
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
    id: "5",
    name: "Waterfall Way",
    image: "/scenic3.jpg",
    location: "Armidale, Australia",
    duration: "3 hours",
    distance: "45 kilometers",
    description: "Iconic valley with waterfalls, meadows, and granite peaks",
  },
  {
    id: "6",
    name: "Mount Panorama Motor Racing Circuit",
    image: "/scenic4.jpg",
    location: "Bathurst, Australia",
    duration: "4 hours",
    distance: "35 kilometers",
    description: "Breathtaking views of one of the world's natural wonders",
  },
  {
    id: "7",
    name: "Thunderbolt's Way",
    image: "/scenic5.jpg",
    location: "Bega, Australia",
    duration: "10 hours",
    distance: "103 kilometers",
    description: "Scenic coastal drive with waterfalls and tropical landscapes",
  },
  {
    id: "8",
    name: "Bylong Valley Way",
    image: "/scenic6.jpg",
    location: "Bylong, Australia",
    duration: "2.5 hours",
    distance: "56 kilometers",
    description:
      "Stunning Mediterranean coastline with colorful cliffside villages",
  },
  {
    id: "9",
    name: "Sealy Lookout",
    image: "/scenic7.jpg",
    location: "Sealy, Australia",
    duration: "2 hours",
    distance: "40 kilometers",
    description:
      "Circular route showcasing Iceland's diverse landscapes and waterfalls",
  },
  {
    id: "10",
    name: "Mungo Loop Track",
    image: "/scenic8.jpg",
    location: "Mungo, Australia",
    duration: "5 hours",
    distance: "308 kilometers",
    description: "Stunning mountain views through Australia's Victorian Alps",
  },
];
