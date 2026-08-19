import AIConfigManager from "@/features/ai-config/AIConfigManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Configuration & Prompt Templates | iStash admin",
  description: "Manage AI configuration, prompt templates, and model settings for iStash.",
};

export default function AIConfigPage() {
  return (
<<<<<<< HEAD:src/app/(dashboard)/ai-config/page.tsx
    <main className="space-y-6">
      <AIConfigManager />
=======
    <main className="space-y-6 font-google-sans">
      <AIConfigForm />
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f:src/app/[locale]/(dashboard)/ai-config/page.tsx
    </main>
  );
}
