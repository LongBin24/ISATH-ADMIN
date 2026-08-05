import AIConfigForm from "@/features/ai-config/AIConfigForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Configuration | iStash admin",
  description: "Manage AI configuration and model settings for iStash.",
};

export default function AIConfigPage() {
  return (
    <main className="space-y-6">
      <AIConfigForm />
    </main>
  );
}
