import { NextResponse } from "next/server";

interface MockAuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string | null;
  createdAt: string;
}

const mockAuditLogs: MockAuditLog[] = [
  {
    id: "bbd3c8ae-e7b7-4ba9-9c05-e1d2a31aee37",
    userId: null,
    action: "CREATE",
    entityType: "CONTACT_MESSAGE",
    entityId: "21e1f22d-527d-4466-844c-f8fdb62a3b9c",
    ipAddress: "127.0.0.1",
    createdAt: "2026-08-21T22:27:37.375459Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    action: "CREATE",
    entityType: "CONTACT_MESSAGE",
    entityId: "123e4567-e89b-12d3-a456-426614174000",
    ipAddress: "192.168.1.45",
    createdAt: "2026-08-24T08:34:59.605Z",
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    userId: "b2f5056d-8e67-4fbf-a0bf-7bb78ae5e153",
    action: "UPDATE",
    entityType: "CATEGORY",
    entityId: "cat-invest-998822",
    ipAddress: "116.212.150.12",
    createdAt: "2026-08-24T06:15:20.120Z",
  },
  {
    id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
    userId: "adm-001-master-super-user",
    action: "SUSPEND",
    entityType: "USER",
    entityId: "usr-suspended-445522",
    ipAddress: "103.216.50.88",
    createdAt: "2026-08-23T18:40:10.000Z",
  },
  {
    id: "77aa88bb-99cc-00dd-11ee-22ff33aa44bb",
    userId: "adm-001-master-super-user",
    action: "UPDATE",
    entityType: "CURRENCY",
    entityId: "USD",
    ipAddress: "127.0.0.1",
    createdAt: "2026-08-23T11:22:33.450Z",
  },
  {
    id: "33bb44cc-55dd-66ee-77ff-88aa99bb00cc",
    userId: "adm-002-finance-officer",
    action: "CREATE",
    entityType: "ALERT_RULE",
    entityId: "rule-budget-exceeded-80",
    ipAddress: "192.168.1.102",
    createdAt: "2026-08-22T14:05:11.890Z",
  },
  {
    id: "55dd66ee-77ff-88aa-99bb-00cc11dd22ee",
    userId: "c4a5056d-8e67-4fbf-a0bf-7bb78ae5e199",
    action: "LOGIN",
    entityType: "AUTH",
    entityId: "sess-9988112233",
    ipAddress: "96.45.12.180",
    createdAt: "2026-08-22T08:12:44.200Z",
  },
  {
    id: "88ee99ff-00aa-11bb-22cc-33dd44ee55ff",
    userId: "adm-001-master-super-user",
    action: "DELETE",
    entityType: "CATEGORY",
    entityId: "cat-deprecated-junk",
    ipAddress: "127.0.0.1",
    createdAt: "2026-08-21T15:30:00.000Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(
    searchParams.get("page") || searchParams.get("pageNumber") || "0",
    10
  );
  const size = parseInt(
    searchParams.get("size") || searchParams.get("pageSize") || "20",
    10
  );
  const query = (
    searchParams.get("query") ||
    searchParams.get("search") ||
    ""
  ).toLowerCase().trim();
  const actionParam = searchParams.get("action");
  const entityTypeParam = searchParams.get("entityType");
  const userIdParam = searchParams.get("userId");

  let filtered = [...mockAuditLogs];

  if (actionParam && actionParam !== "ALL") {
    filtered = filtered.filter(
      (item) => item.action.toUpperCase() === actionParam.toUpperCase()
    );
  }

  if (entityTypeParam && entityTypeParam !== "ALL") {
    filtered = filtered.filter(
      (item) => item.entityType.toUpperCase() === entityTypeParam.toUpperCase()
    );
  }

  if (userIdParam && userIdParam.trim()) {
    filtered = filtered.filter((item) => item.userId === userIdParam.trim());
  }

  if (query) {
    filtered = filtered.filter(
      (item) =>
        item.action.toLowerCase().includes(query) ||
        item.entityType.toLowerCase().includes(query) ||
        item.entityId.toLowerCase().includes(query) ||
        (item.ipAddress && item.ipAddress.toLowerCase().includes(query)) ||
        (item.userId && item.userId.toLowerCase().includes(query)) ||
        item.id.toLowerCase().includes(query)
    );
  }

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const start = page * size;
  const content = filtered.slice(start, start + size);

  return NextResponse.json({
    success: true,
    message: "Audit logs retrieved successfully.",
    data: {
      content,
      page,
      size,
      totalElements,
      totalPages,
      first: page === 0,
      last: page >= totalPages - 1,
    },
    timestamp: new Date().toISOString(),
  });
}
