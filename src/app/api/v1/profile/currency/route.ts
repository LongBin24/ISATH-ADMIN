import { NextResponse } from "next/server";
import { updateMockProfile } from "../mockState";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = updateMockProfile({
      preferredCurrency: body.currency,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "មិនអាចផ្លាស់ប្តូររូបិយប័ណ្ណបានទេ" },
      { status: 400 }
    );
  }
}
