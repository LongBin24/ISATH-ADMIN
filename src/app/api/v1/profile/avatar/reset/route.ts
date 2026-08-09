import { NextResponse } from "next/server";
import { updateMockProfile } from "../../mockState";

const DEFAULT_AVATAR_URL = "https://api.dicebear.com/7.x/bottts/svg?seed=istashUser&backgroundColor=003377";

export async function POST() {
  const updated = updateMockProfile({
    avatar: DEFAULT_AVATAR_URL,
    isDefaultAvatar: true,
  });
  return NextResponse.json(updated);
}
