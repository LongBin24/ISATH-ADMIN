import AuditLogManager from "@/features/audit-logs/AuditLogManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "របាយការណ៍សកម្មភាព | អ្នកគ្រប់គ្រង iStash",
  description:
    "តាមដាន និងពិនិត្យរបាយការណ៍សកម្មភាព និងសកម្មភាពប្រតិបត្តិការផ្សេងៗក្នុងប្រព័ន្ធ iStash។",
};

export default function DashboardAuditLogsPage() {
  return <AuditLogManager />;
}
