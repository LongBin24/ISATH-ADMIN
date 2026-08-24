import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { message: "សូមបញ្ចូលពាក្យសម្ងាត់ឱ្យបានត្រឹមត្រូវ" },
        { status: 400 }
      );
    }
    return NextResponse.json({
      message: "ផ្លាស់ប្តូរពាក្យសម្ងាត់បានជោគជ័យ!",
    });
  } catch {
    return NextResponse.json(
      { message: "មានបញ្ហាក្នុងការផ្លាស់ប្តូរពាក្យសម្ងាត់" },
      { status: 500 }
    );
  }
}
