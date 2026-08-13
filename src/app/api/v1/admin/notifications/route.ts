import { NextResponse } from "next/server";

const mockNotifications = [
  {
    id: "notif-001",
    userId: "usr-101",
    actorUserId: "admin-01",
    title: "បានផ្ញើការរំលឹកចំណាយប្រចាំថ្ងៃ",
    message: "ប្រព័ន្ធបានផ្ញើការរំលឹកចំណាយប្រចាំថ្ងៃទៅកាន់អ្នកប្រើប្រាស់ចំនួន ១៥០ នាក់រួចរាល់។",
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
    message: "អ្នកប្រើប្រាស់រ៉ូសាលីនបានប្រើប្រាស់ថវិកាហួស ៩០% នៃកញ្ចប់ថវិកាប្រចាំខែ។",
    notificationType: "BUDGET_WARNING",
    category: "BUDGET_WARNING",
    channels: ["IN_APP"],
    priority: "HIGH",
    read: false,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "notif-003",
    userId: "usr-103",
    title: "សម្រេចបានគោលដៅសន្សំប្រាក់!",
    message: "អ្នកប្រើប្រាស់សុខា បានសម្រេចគោលដៅសន្សំប្រាក់ទិញម៉ូតូ ១,៥០០ ដុល្លារ។",
    notificationType: "SAVINGS_REMINDER",
    category: "SAVINGS_GOAL",
    channels: ["IN_APP", "EMAIL"],
    priority: "MEDIUM",
    read: true,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageNumber = parseInt(searchParams.get("pageNumber") || "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  const start = pageNumber * pageSize;
  const content = mockNotifications.slice(start, start + pageSize);

  return NextResponse.json({
    content,
    page: {
      number: pageNumber,
      size: pageSize,
      totalElements: mockNotifications.length,
      totalPages: Math.ceil(mockNotifications.length / pageSize),
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: body.userId || "usr-[#003377]",
      title: body.title || "ការជូនដំណឹងថ្មី",
      message: body.message || "",
      notificationType: body.notificationType || "DAILY_REMINDER",
      category: body.notificationType || "DAILY_REMINDER",
      channels: body.channels || ["IN_APP"],
      priority: "MEDIUM",
      read: false,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    mockNotifications.unshift(newNotif);
    return NextResponse.json(newNotif, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
  }
}
