import FeedbackPage from "@/features/feedback/FeedbackPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "គ្រប់គ្រងមតិកែលម្អ | អ្នកគ្រប់គ្រង iStash",
  description:
    "គ្រប់គ្រងមតិកែលម្អ ការវាយតម្លៃ និងសំណើជំនួយរបស់អ្នកប្រើប្រាស់។",
};

export default function DashboardFeedbackPage() {
  return <FeedbackPage />;
}
