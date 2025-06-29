import { PrismaClient } from "@prisma/client";

async function allLocations(prisma:PrismaClient){
  await prisma.$connect();
  const allLocations = prisma.location.findMany({
    take:30
  });
  return allLocations;
}