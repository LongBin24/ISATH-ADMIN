import { NextResponse } from "next/server";
import { setCurrencyActiveState } from "../../currencyService";

async function handleDeactivate(request: Request, params: Promise<{ code: string }>) {
  try {
    const { code } = await params;
    const updatedCurrency = setCurrencyActiveState(code, false);

    if (!updatedCurrency) {
      return NextResponse.json(
        {
          success: false,
          message: `Currency code '${code}' not found.`,
          data: null,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Currency ${code.toUpperCase()} deactivated successfully.`,
      data: updatedCurrency,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "មានបញ្ហាក្នុងការបិទដំណើរការរូបិយប័ណ្ណ",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ code: string }> }) {
  return handleDeactivate(request, context.params);
}

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  return handleDeactivate(request, context.params);
}

export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  return handleDeactivate(request, context.params);
}
