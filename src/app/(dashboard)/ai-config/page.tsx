import AIConfigManager from "@/features/ai-config/AIConfigManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Configuration & Prompt Templates | iStash admin",
  description: "Manage AI configuration, prompt templates, and model settings for iStash.",
};

export default function AIConfigPage() {
  return (
    <main className="space-y-6">
      <AIConfigManager />
    </main>
  );
}
