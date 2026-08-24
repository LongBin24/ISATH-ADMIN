import { NextResponse } from "next/server";
import { updateMockProfile } from "../mockState";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = updateMockProfile({
      notifications: body.notifications,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "មិនអាចផ្លាស់ប្តូរការកំណត់ជូនដំណឹងបានទេ" },
      { status: 400 }
    );
  }
}
