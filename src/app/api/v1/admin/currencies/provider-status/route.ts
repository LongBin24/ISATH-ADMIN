import { NextResponse } from "next/server";
import { getLiveProviderStatus } from "../currencyService";

export async function GET() {
  try {
    const statusData = await getLiveProviderStatus();
    return NextResponse.json({
      success: true,
      message: "Currency-provider status retrieved successfully.",
      data: statusData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "មិនអាចទាញយកព័ត៌មានស្ថានភាព Provider បានទេ",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

