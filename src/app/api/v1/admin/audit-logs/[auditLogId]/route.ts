import { NextResponse } from "next/server";

interface MockAuditLogDetail {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

const mockAuditLogDetails: MockAuditLogDetail[] = [
  {
    id: "bbd3c8ae-e7b7-4ba9-9c05-e1d2a31aee37",
    userId: null,
    action: "CREATE",
    entityType: "CONTACT_MESSAGE",
    entityId: "21e1f22d-527d-4466-844c-f8fdb62a3b9c",
    oldValues: null,
    newValues: {
      array: false,
      bigDecimal: false,
      bigInteger: false,
      binary: false,
      boolean: false,
      containerNode: true,
      double: false,
      empty: false,
      float: false,
      floatingPointNumber: false,
      int: false,
      integralNumber: false,
      long: false,
      missingNode: false,
      nodeType: "OBJECT",
      null: false,
      number: false,
      object: true,
      pojo: false,
      short: false,
      textual: false,
      valueNode: false,
    },
    ipAddress: "127.0.0.1",
    userAgent: "curl/8.7.1",
    createdAt: "2026-08-21T22:27:37.375459Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    action: "CREATE",
    entityType: "CONTACT_MESSAGE",
    entityId: "123e4567-e89b-12d3-a456-426614174000",
    oldValues: null,
    newValues: {
      name: "រ៉ូសាលីន កែវ",
      email: "rosalin.keo@istash.app",
      subject: "ជំនួយក្នុងការធ្វើសមកាលកម្មគណនី",
    },
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    createdAt: "2026-08-24T08:34:59.605Z",
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    userId: "b2f5056d-8e67-4fbf-a0bf-7bb78ae5e153",
    action: "UPDATE",
    entityType: "CATEGORY",
    entityId: "cat-invest-998822",
    oldValues: {
      name: "Investment Old",
      color: "#3B82F6",
      status: "INACTIVE",
    },
    newValues: {
      name: "Investment & Stocks",
      color: "#22C55E",
      status: "ACTIVE",
    },
    ipAddress: "116.212.150.12",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    createdAt: "2026-08-24T06:15:20.120Z",
  },
  {
    id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
    userId: "adm-001-master-super-user",
    action: "SUSPEND",
    entityType: "USER",
    entityId: "usr-suspended-445522",
    oldValues: {
      status: "ACTIVE",
      suspensionReason: null,
    },
    newValues: {
      status: "SUSPENDED",
      suspensionReason: "Suspicious login attempts exceeding threshold.",
    },
    ipAddress: "103.216.50.88",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    createdAt: "2026-08-23T18:40:10.000Z",
  },
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ auditLogId?: string; id?: string }> }
) {
  const resolvedParams = await params;
  const targetId = resolvedParams.auditLogId || resolvedParams.id;
  const log = mockAuditLogDetails.find((item) => item.id === targetId);

  if (!log) {
    return NextResponse.json(
      {
        success: false,
        message: "Audit log not found.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Audit log retrieved successfully.",
    data: log,
    timestamp: new Date().toISOString(),
  });
}
