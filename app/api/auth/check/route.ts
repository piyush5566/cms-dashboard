import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    return NextResponse.json(
      { isLoggedIn: !!session },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { isLoggedIn: false, error: "Failed to check authentication status" },
      { status: 500 }
    );
  }
}
