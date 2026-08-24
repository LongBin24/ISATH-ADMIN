import ContactUsManager from "@/features/contact-us/ContactUsManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "គ្រប់គ្រងសារទំនាក់ទំនង | អ្នកគ្រប់គ្រង iStash",
  description:
    "គ្រប់គ្រង មើល និងឆ្លើយតបសារទំនាក់ទំនងពីអ្នកប្រើប្រាស់ និងភ្ញៀវក្នុងប្រព័ន្ធ iStash។",
};

export default function DashboardContactUsPage() {
  return <ContactUsManager />;
}
