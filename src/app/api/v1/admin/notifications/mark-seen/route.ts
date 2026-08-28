import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const timestamp =
      body.seenThrough ||
      body.lastSeenAt ||
      new Date().toISOString();
    const unseenCount =
      typeof body.unseenCount === "number" ? body.unseenCount : 0;

    return NextResponse.json(
      {
        seenThrough: timestamp,
        lastSeenAt: timestamp,
        unseenCount,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid mark-seen request payload" },
      { status: 400 },
    );
  }
}
