import { NextResponse } from "next/server";
import { setCurrencyActiveState } from "../../currencyService";

async function handleActivate(request: Request, params: Promise<{ code: string }>) {
  try {
    const { code } = await params;
    const updatedCurrency = setCurrencyActiveState(code, true);

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
      message: `Currency ${code.toUpperCase()} activated successfully.`,
      data: updatedCurrency,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "មានបញ្ហាក្នុងការបើកដំណើរការរូបិយប័ណ្ណ",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ code: string }> }) {
  return handleActivate(request, context.params);
}

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  return handleActivate(request, context.params);
}

export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  return handleActivate(request, context.params);
}
