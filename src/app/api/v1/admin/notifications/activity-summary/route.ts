import { NextResponse } from "next/server";

const mockActivitySummary = {
  stateInitialized: true,
  unseenCount: 0,
  lastSeenAt: "2026-08-28T07:05:55.902Z",
  seenThrough: "2026-08-28T07:04:25.045733Z",
  activities: [
    {
      activityId: "92ae3ef9-23d8-4e63-94a1-acaaa12c1e6d",
      activityType: "NOTIFICATION",
      title: "Wallet Invitation Accepted",
      message: "Thai Vathanak joined “Wallet with Friend”.",
      notificationType: "WALLET_MEMBER_JOINED",
      recipientCount: 1,
      createdAt: "2026-08-28T07:04:25.045733Z",
    },
    {
      activityId: "31d49726-aacb-405d-a2ed-9fc064670558",
      activityType: "NOTIFICATION",
      title: "Wallet Invitation",
      message:
        "You were invited to join “Wallet with Friend” as a MEMBER. Join here: ${WALLET_INVITATION_JOIN_URL}",
      notificationType: "WALLET_INVITATION",
      recipientCount: 1,
      createdAt: "2026-08-28T07:04:06.081024Z",
    },
    {
      activityId: "b6c6535b-532e-4c45-965c-9d221b90c1aa",
      activityType: "NOTIFICATION",
      title: "Wallet Role Changed",
      message:
        "Your role in “Wallet with Friend” changed from MEMBER to OWNER.",
      notificationType: "WALLET_ROLE_CHANGED",
      recipientCount: 1,
      createdAt: "2026-08-28T06:56:26.174799Z",
    },
    {
      activityId: "ee978295-c1fe-4eef-9f9e-d7f63287646a",
      activityType: "NOTIFICATION",
      title: "Wallet Role Changed",
      message:
        "Your role in “Wallet with Friend” changed from OWNER to ADMIN.",
      notificationType: "WALLET_ROLE_CHANGED",
      recipientCount: 1,
      createdAt: "2026-08-28T06:56:26.161036Z",
    },
    {
      activityId: "105353e2-4a57-4a38-8b75-b3b7a51e0a53",
      activityType: "NOTIFICATION",
      title: "Wallet Invitation Accepted",
      message: "Hongly Boun joined “Wallet with Friend”.",
      notificationType: "WALLET_MEMBER_JOINED",
      recipientCount: 1,
      createdAt: "2026-08-28T06:51:27.468854Z",
    },
    {
      activityId: "484e4b43-ae82-4842-8ea2-8fe9e065fba7",
      activityType: "NOTIFICATION",
      title: "Wallet Invitation",
      message:
        "You were invited to join “SS” as a MEMBER. Join here: ${WALLET_INVITATION_JOIN_URL}",
      notificationType: "WALLET_INVITATION",
      recipientCount: 1,
      createdAt: "2026-08-28T06:48:08.138360Z",
    },
    {
      activityId: "27d99a62-714f-4a60-887b-a62c0e2017d7",
      activityType: "NOTIFICATION",
      title: "Daily expense reminder",
      message: "Remember to record today's expenses.",
      notificationType: "DAILY_REMINDER",
      recipientCount: 1,
      createdAt: "2026-08-28T06:00:01.074709Z",
    },
    {
      activityId: "b6f472c7-83cb-4a12-9164-7865229ca194",
      activityType: "NOTIFICATION",
      title: "Daily expense reminder",
      message: "Remember to record today's expenses.",
      notificationType: "DAILY_REMINDER",
      recipientCount: 1,
      createdAt: "2026-08-28T06:00:01.047534Z",
    },
    {
      activityId: "7c07bff0-6034-47fd-888c-6d5f7a68f52d",
      activityType: "NOTIFICATION",
      title: "Daily expense reminder",
      message: "Remember to record today's expenses.",
      notificationType: "DAILY_REMINDER",
      recipientCount: 1,
      createdAt: "2026-08-28T06:00:01.016114Z",
    },
    {
      activityId: "b088a771-fe22-47d4-be2f-25ec429d604d",
      activityType: "NOTIFICATION",
      title: "Daily expense reminder",
      message: "Remember to record today's expenses.",
      notificationType: "DAILY_REMINDER",
      recipientCount: 1,
      createdAt: "2026-08-28T06:00:00.987663Z",
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const activities = mockActivitySummary.activities.slice(0, limit);

  return NextResponse.json(
    {
      ...mockActivitySummary,
      activities,
    },
    { status: 200 },
  );
}
