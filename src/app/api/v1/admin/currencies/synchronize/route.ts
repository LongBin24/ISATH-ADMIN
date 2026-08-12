import { NextResponse } from "next/server";
import { synchronizeLiveCurrencies } from "../currencyService";

async function handleSync() {
  try {
    const syncData = await synchronizeLiveCurrencies();
    return NextResponse.json({
      success: true,
      message: "Currencies and exchange rates synchronized successfully.",
      data: syncData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "ការធ្វើសមកាលកម្មអត្រាប្តូរប្រាក់មានបញ្ហា",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return handleSync();
}

export async function GET() {
  return handleSync();
}
