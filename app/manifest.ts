import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Warehouse",
    short_name: "Warehouse",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
