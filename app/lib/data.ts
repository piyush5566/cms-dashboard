import prisma from "@/app/lib/prisma";
import { Customer, InvoiceWithCustomer } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";
import { Prisma } from "@/generated/prisma"; // Or from '@prisma/client' if @/generated/prisma doesn't export Prisma namespace

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoices.findMany({
      orderBy: { date: "desc" },
      take: 5,
      include: {
        customer: true,
      }, // Cast to any to match the structure before mapping, or define a more precise intermediate type
    });
    const latestInvoices = data.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer.name,
      image_url: invoice.customer.image_url,
      email: invoice.customer.email,
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, paidInvoices, pendingInvoices] =
      await Promise.all([
        prisma.invoices.count(),
        prisma.customers.count(),
        prisma.invoices.aggregate({
          where: { status: "paid" },
          _sum: { amount: true },
        }),
        prisma.invoices.aggregate({
          where: { status: "pending" },
          _sum: { amount: true },
        }),
      ]);

    const totalPaidInvoices = formatCurrency(paidInvoices._sum.amount || 0);
    const totalPendingInvoices = formatCurrency(
      pendingInvoices._sum.amount || 0
    );

    return {
      numberOfCustomers: customerCount,
      numberOfInvoices: invoiceCount,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const amountQuery = Number(query);
  const isValidAmount = !Number.isNaN(amountQuery) && query.trim() !== "";

  const dateQuery = new Date(query);
  const isValidDate =
    !Number.isNaN(dateQuery.getTime()) &&
    query.trim() !== "" &&
    /\d/.test(query);

  const orConditions: Prisma.invoicesWhereInput[] = [];

  if (query.trim() !== "") {
    orConditions.push({
      customer: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
    orConditions.push({
      customer: {
        email: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
    orConditions.push({
      status: {
        contains: query,
        mode: "insensitive",
      },
    });
  }

  if (isValidAmount) {
    orConditions.push({ amount: amountQuery });
  }

  if (isValidDate) {
    orConditions.push({ date: dateQuery });
  }

  try {
    const invoices = (await prisma.invoices.findMany({
      where: {
        OR: orConditions.length > 0 ? orConditions : undefined,
      },
      include: {
        customer: true,
      },
      orderBy: { date: "desc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    })) as InvoiceWithCustomer[];

    return invoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount,
      date: invoice.date.toISOString(), // Ensure date is string if expected by consuming components
      status: invoice.status,
      customer_id: invoice.customer_id,
      name: invoice.customer.name,
      email: invoice.customer.email,
      image_url: invoice.customer.image_url,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const amountQuery = Number(query);
    const isValidAmount = !Number.isNaN(amountQuery) && query.trim() !== "";

    const dateQuery = new Date(query);
    const isValidDate =
      !Number.isNaN(dateQuery.getTime()) &&
      query.trim() !== "" &&
      /\d/.test(query);

    const orConditions: Prisma.invoicesWhereInput[] = [];

    if (query.trim() !== "") {
      orConditions.push({
        customer: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      });
      orConditions.push({
        customer: {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      });
      orConditions.push({
        status: {
          contains: query,
          mode: "insensitive",
        },
      });
    }

    if (isValidAmount) {
      orConditions.push({ amount: amountQuery });
    }

    if (isValidDate) {
      orConditions.push({ date: dateQuery });
    }

    const count = await prisma.invoices.count({
      where: {
        OR: orConditions.length > 0 ? orConditions : undefined,
      },
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { id },
    });
    if (!invoice) return null;
    return {
      ...invoice,
      amount: invoice.amount / 100,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customers.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    // This is a simplified version; for full aggregation, use Prisma's aggregate or raw query
    const customers = await prisma.customers.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
    });
    // You can add aggregation logic here if needed
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customers.findMany({
    orderBy: { name: "asc" },
  });

  return customers.map((customer: any) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    company: customer.company || "",
    status: (customer.status as "active" | "inactive") || "inactive",
    totalOrders: customer.total_orders || 0,
    totalSpent: customer.total_spent || 0,
    lastOrderDate: customer.last_order_date?.toISOString() || "",
    image_url: customer.image_url,
  }));
}
