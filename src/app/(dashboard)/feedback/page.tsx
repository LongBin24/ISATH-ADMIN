import FeedbackPage from "@/features/feedback/FeedbackPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback Management | iStash admin",
  description:
    "Manage user feedback, ratings, and support requests in the iStash admin dashboard.",
};

export default function DashboardFeedbackPage() {
  return <FeedbackPage />;
}
