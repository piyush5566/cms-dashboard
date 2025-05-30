import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Customer } from "@/app/lib/definitions";
import type { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 6;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const status = searchParams.get("status") || "all";
    const sort = searchParams.get("sort") || "name";
    const direction = searchParams.get("direction") || "asc";

    // Calculate pagination
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Build where clause
    const where: Prisma.customersFindManyArgs["where"] = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
        ],
      }),
    };

    // Handle status filter separately to ensure consistent behavior
    if (status !== "all") {
      where.status = status.toLowerCase();
    }

    // Get total count for pagination
    const totalCount = await prisma.customers.count({ where });
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Get customers with pagination and sorting
    const customers = await prisma.customers.findMany({
      where,
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: {
        [sort]: direction,
      },
    });

    // Format the response
    const formattedCustomers: Customer[] = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      company: customer.company || "",
      status: (customer.status || "inactive") as "active" | "inactive",
      totalOrders: customer.total_orders || 0,
      totalSpent: customer.total_spent || 0,
      lastOrderDate: customer.last_order_date?.toISOString() || "",
      image_url: customer.image_url,
    }));

    return NextResponse.json({
      customers: formattedCustomers,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
