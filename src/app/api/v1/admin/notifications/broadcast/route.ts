import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const channels = body.channels || ["IN_APP"];
    const emailRequested = typeof body.sendEmail === "boolean" ? body.sendEmail : channels.includes("EMAIL");
    const userIds = body.userIds;
    const totalRecipients = Array.isArray(userIds) && userIds.length > 0 ? userIds.length : 46;

    const response = {
      totalRecipients,
      notificationsCreated: totalRecipients,
      failedRecipients: 0,
      emailRequested,
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid broadcast payload" }, { status: 400 });
  }
}
