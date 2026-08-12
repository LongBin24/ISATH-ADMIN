import { NextResponse } from "next/server";
import { fetchLiveExchangeRates } from "./currencyService";

export async function GET() {
  try {
    const liveRates = await fetchLiveExchangeRates();
    return NextResponse.json({
      success: true,
      message: "ទាញយករូបិយប័ណ្ណជោគជ័យ",
      data: liveRates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "មិនអាចទាញយករូបិយប័ណ្ណបានទេ",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

