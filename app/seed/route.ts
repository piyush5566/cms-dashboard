import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";

async function seedUsers() {
  await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.users.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });
    })
  );
}

async function seedCustomers() {
  await Promise.all(
    customers.map(async (customer) => {
      await prisma.customers.upsert({
        where: { id: customer.id },
        update: {
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url,
          company: customer.company ?? null,
          status: customer.status ?? null,
          total_orders: customer.totalOrders ?? null,
          total_spent: customer.totalSpent ?? null,
          last_order_date: customer.lastOrderDate
            ? new Date(customer.lastOrderDate)
            : null,
        },
        create: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url,
          company: customer.company ?? null,
          status: customer.status ?? null,
          total_orders: customer.totalOrders ?? null,
          total_spent: customer.totalSpent ?? null,
          last_order_date: customer.lastOrderDate
            ? new Date(customer.lastOrderDate)
            : null,
        },
      });
    })
  );
}

async function seedInvoices() {
  await Promise.all(
    invoices.map(async (invoice) => {
      await prisma.invoices.create({
        data: {
          customer_id: invoice.customer_id,
          amount: invoice.amount,
          status: invoice.status,
          date: new Date(invoice.date),
        },
      });
    })
  );
}

async function seedRevenue() {
  await Promise.all(
    revenue.map(async (rev) => {
      await prisma.revenue.upsert({
        where: { month: rev.month },
        update: { revenue: rev.revenue },
        create: { month: rev.month, revenue: rev.revenue },
      });
    })
  );
}

export async function GET() {
  // return Response.json({
  //   message:
  //     "Uncomment this file and remove this line. You can delete this file when you are finished.",
  // });
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
