import { NextResponse } from "next/server";
import { fetchFilteredInvoices } from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  try {
    const invoices = await fetchFilteredInvoices(query, page);
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
