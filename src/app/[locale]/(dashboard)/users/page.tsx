import UserManagerPage from "@/features/users/UserManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | iStash admin",
  description: "ការគ្រប់គ្រងអ្នកប្រើប្រាស់ iStash",
};

export default function UsersPage() {
  return <UserManagerPage />;
}
