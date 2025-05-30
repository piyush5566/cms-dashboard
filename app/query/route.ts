import prisma from "@/app/lib/prisma";

async function listInvoices() {
  const data = await prisma.invoices.findMany({
    where: { amount: 666 },
    include: {
      customer: true,
    },
  });
  return data.map((invoice) => ({
    amount: invoice.amount,
    name: invoice.customer.name,
  }));
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
