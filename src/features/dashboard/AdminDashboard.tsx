"use client"

import { Users, RefreshCw, AlertTriangle } from "lucide-react";
import StatsCard from "./components/StatsCard";
import UserTable from "./components/UserTable";
import QuickMenu from "./components/QuickMenu";
import AIStatus from "./components/AIStatus";
import { useGetStatsQuery } from "./api";

const sampleUsers = [
  {
    id: "1",
    name: "Sokha",
    email: "sokha@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Mina",
    email: "mina@example.com",
    role: "user",
    status: "inactive",
  },
];

export default function AdminDashboard() {
  const { data: stats } = useGetStatsQuery();

  return (
    <div className="flex flex-col gap-8 p-8 font-google">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="អ្នកប្រើប្រាស់សរុប"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="#FFC83D"
        />
        <StatsCard
          title="ប្រតិបត្តិការសរុប"
          value={stats?.totalProcess || 0}
          icon={RefreshCw}
          color="#003377"
        />
        <StatsCard
          title="មិនសកម្ម"
          value={stats?.inActiveUsers || 0}
          icon={AlertTriangle}
          color="#ef4444"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 text-[#003377] dark:text-white">
            អ្នកប្រើប្រាស់ថ្មី
          </h2>
          <UserTable users={sampleUsers} />
        </div>

        <div className="flex flex-col gap-8">
          <QuickMenu />
          <AIStatus />
        </div>
      </div>
    </div>
  );
}
