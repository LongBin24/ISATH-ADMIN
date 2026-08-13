import type { Metadata } from "next";
import SystemStatePage from "@/components/system/SystemStatePage";

export const metadata: Metadata = {
  title: "Network Error | iStash Admin",
  description: "iStash Admin could not connect to the network.",
};

export default function NetworkErrorPage() {
  return <SystemStatePage kind="network" />;
}
