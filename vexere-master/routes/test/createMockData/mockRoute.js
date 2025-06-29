import { prisma } from '../../../server';
const routeData = [
    {
        id: 1,
        startLocId: 5,
        endLocId: 7
    },
    {
        id: 2,
        startLocId: 7,
        endLocId: 5
    },
    {
        id: 3,
        startLocId: 5,
        endLocId: 8
    },
    {
        id: 4,
        startLocId: 8,
        endLocId: 5
    },
    {
        id: 5,
        startLocId: 5,
        endLocId: 9
    },
    {
        id: 6,
        startLocId: 9,
        endLocId: 5
    },
    {
        id: 7,
        startLocId: 1,
        endLocId: 3
    },
    {
        id: 8,
        startLocId: 3,
        endLocId: 1
    },
    {
        id: 9,
        startLocId: 2,
        endLocId: 4,
    },
    {
        id: 10,
        startLocId: 4,
        endLocId: 2
    }
];
const routeGenerate = async (req, res) => {
    if (req.method !== "GET") {
        res.status(200).json({ error: "Plese use a GET method" });
        return;
    }
    const { password } = req.query;
    console.log(password);
    if (!password || password !== "vexere123") {
        res.status(200).json({
            error: "Invalid request params",
            input: password ? password : "Unknow"
        });
        return;
    }
    await prisma.$connect();
    const createResult = await prisma.route.createMany({
        data: routeData,
        skipDuplicates: true
    });
    res.status(200).json({
        insertCount: createResult.count
    });
};
export default routeGenerate;
export { routeData };
