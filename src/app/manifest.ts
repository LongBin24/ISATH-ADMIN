import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iStash - កម្មវិធីគ្រប់គ្រងហិរញ្ញវត្ថុ",
    short_name: "iStash",
    description: "ប្រព័ន្ធគ្រប់គ្រងហិរញ្ញវត្ថុ និងការជូនដំណឹងអូតូម៉ាតិក iStash Financial Management",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#003377",
    theme_color: "#003377",
    categories: ["finance", "productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "Open iStash Dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "AI Support",
        short_name: "AI",
        description: "Open AI Support & Templates",
        url: "/ai-config",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Notifications",
        short_name: "Alerts",
        description: "View System Notifications",
        url: "/notifications",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Users",
        short_name: "Users",
        description: "User Management",
        url: "/user-manager",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
