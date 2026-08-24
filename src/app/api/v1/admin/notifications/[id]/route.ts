import { NextResponse } from "next/server";

const mockNotifications: Record<string, unknown>[] = [
  {
    id: "notif-001",
    userId: "usr-101",
    actorUserId: "admin-01",
    title: "បានផ្ញើការរំលឹកចំណាយប្រចាំថ្ងៃ",
    message:
      "ប្រព័ន្ធបានផ្ញើការរំលឹកចំណាយប្រចាំថ្ងៃទៅកាន់អ្នកប្រើប្រាស់ចំនួន ១៥០ នាក់រួចរាល់។",
    notificationType: "DAILY_REMINDER",
    category: "DAILY_REMINDER",
    channels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
    read: false,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actionUrl: "/notifications",
  },
  {
    id: "notif-002",
    userId: "usr-102",
    title: "កញ្ចប់ថវិកាហួសកម្រិតកំណត់ (90%)",
    message:
      "អ្នកប្រើប្រាស់រ៉ូសាលីនបានប្រើប្រាស់ថវិកាហួស ៩០% នៃកញ្ចប់ថវិកាប្រចាំខែ។",
    notificationType: "BUDGET_WARNING",
    category: "BUDGET_WARNING",
    channels: ["IN_APP"],
    priority: "HIGH",
    read: false,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = mockNotifications.find((n) => n.id === id) || {
    id,
    userId: "usr-system",
    title: "ប្រព័ន្ធការជូនដំណឹង",
    message: "ព័ត៌មានលម្អិតនៃប្រព័ន្ធការជូនដំណឹងសម្រាប់ ID: " + id,
    notificationType: "DAILY_REMINDER",
    read: false,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(item);
}
