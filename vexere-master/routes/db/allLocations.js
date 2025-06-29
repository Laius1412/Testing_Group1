async function allLocations(prisma) {
    await prisma.$connect();
    const allLocations = prisma.location.findMany({
        take: 30
    });
    return allLocations;
}
export {};
