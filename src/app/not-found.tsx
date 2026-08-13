import type { Metadata } from "next";
import SystemStatePage from "@/components/system/SystemStatePage";

export const metadata: Metadata = {
  title: "Page Not Found | iStash Admin",
  description: "The requested iStash Admin page could not be found.",
};

export default function NotFound() {
  return <SystemStatePage kind="not-found" />;
}
