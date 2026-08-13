import { Metadata } from "next";
import WelcomeIntro from "@/features/auth/components/welcome-intro";

export const metadata: Metadata = {
  title: "Welcome | iStash Admin",
  description: "iStash Admin Portal",
};

export default function WelcomePage() {
  return <WelcomeIntro />;
}
