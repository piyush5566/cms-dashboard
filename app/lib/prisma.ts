import { PrismaClient } from "@/generated/prisma";

// add prisma to the NodeJS global type
// This is needed to prevent hot-reloading in development from creating new instances
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
