import { NextResponse } from "next/server";
import { mockProfileState, updateMockProfile } from "./mockState";

export async function GET() {
  return NextResponse.json(mockProfileState);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = updateMockProfile({
      firstName: body.firstName ?? mockProfileState.firstName,
      lastName: body.lastName ?? mockProfileState.lastName,
      displayName: body.displayName ?? mockProfileState.displayName,
      email: body.email ?? mockProfileState.email,
      phoneNumber: body.phoneNumber ?? mockProfileState.phoneNumber,
      bio: body.bio ?? mockProfileState.bio,
      location: body.location ?? mockProfileState.location,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាពព័ត៌មាន" },
      { status: 400 }
    );
  }
}
