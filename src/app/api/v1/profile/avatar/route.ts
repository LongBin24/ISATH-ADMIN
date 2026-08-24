import { NextResponse } from "next/server";
import { updateMockProfile } from "../mockState";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = updateMockProfile({
      avatar: body.avatarUrl,
      isDefaultAvatar: !!body.isDefault,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "មិនអាចផ្ទុកឡើងរូបភាពបានទេ" },
      { status: 400 }
    );
  }
}
