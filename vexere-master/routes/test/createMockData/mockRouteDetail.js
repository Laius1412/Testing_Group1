import { prisma } from '../../../server';
const today = new Date();
const routeDetailData = [
    {
        "remainSeat": 19, "routeId": 8, "busId": 4,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 18, "routeId": 5, "busId": 1,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 15, "routeId": 3, "busId": 6,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 40, "routeId": 4, "busId": 8,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 33, "routeId": 2, "busId": 8,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 19, "routeId": 7, "busId": 2,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 38, "routeId": 5, "busId": 3,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 26, "routeId": 3, "busId": 5,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 40, "routeId": 1, "busId": 3,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    },
    {
        "remainSeat": 17, "routeId": 7, "busId": 7,
        startTime: new Date(today.getTime() + 3 * 8.64e+7),
        endTime: new Date(today.getTime() + 5 * 8.64e+7),
        price: 0
    }
];
const routeDetailGenerate = async (req, res) => {
    if (req.query && req.query.password && req.query.password === "vexere123") {
        await prisma.$connect();
        // routeDetailData.forEach((item)=>{
        //   console.log(today,item.startTime,item.endTime)
        // })
        const inserted = await prisma.routeDetail.createMany({
            data: routeDetailData,
            skipDuplicates: true
        });
        res.status(200).json({
            detailedCreated: inserted.count,
        });
        return;
    }
    res.status(200).json({
        error: "Wrong queuery params"
    });
};
export default routeDetailGenerate;
