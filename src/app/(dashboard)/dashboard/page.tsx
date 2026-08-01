import AdminDashboard from "@/features/dashboard/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | iStash admin",
    description: "ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ iStash",
}

export default function DashboardPage(){
    return(
        <AdminDashboard/>
    );
}