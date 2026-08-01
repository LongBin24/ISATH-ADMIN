import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "@/features/dashboard/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function UserTable({ users }: { users: any[] }) {
  return (
    <Table className="font-google-sans">
      <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
        <TableRow>
          <TableHead>អ្នកប្រើប្រាស់</TableHead>
          <TableHead>តួនាទី</TableHead>
          <TableHead>ស្ថានភាព</TableHead>
          <TableHead className="text-right">សកម្មភាព</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
          >
            <TableCell className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#003377] text-white flex items-center justify-center font-bold">
                {user.name?.[0] ?? "U"}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 font-google-sans">
                  {user.email}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  user.role === "admin" ? "border-[#FFC83D] text-[#FFC83D]" : ""
                }
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  user.status === "active"
                    ? "bg-green-100 text-green-600 hover:bg-green-100"
                    : "bg-red-100 text-red-600 hover:bg-red-100"
                }
              >
                {user.status === "active" ? "សកម្ម" : "មិនសកម្ម"}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <button className="text-slate-400 hover:text-[#003377]">
                <Eye size={18} />
              </button>
              <button className="text-slate-400 hover:text-blue-500">
                <Pencil size={18} />
              </button>
              <button className="text-slate-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
