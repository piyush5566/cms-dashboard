import { PrismaClient } from "@/generated/prisma";

// add prisma to the NodeJS global type
// This is needed to prevent hot-reloading in development from creating new instances
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
