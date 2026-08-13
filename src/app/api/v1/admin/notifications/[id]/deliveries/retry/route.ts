import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id: `delivery-retry-${Date.now()}`,
    notificationId: id,
    deliveryStatus: "SENT",
    sentAt: new Date().toISOString(),
    message: "បានផ្ញើការជូនដំណឹងឡើងវិញជោគជ័យ (Delivery retried successfully)",
  });
}
