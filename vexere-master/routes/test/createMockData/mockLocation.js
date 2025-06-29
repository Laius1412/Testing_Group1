import { prisma } from '../../../server';
const locationsData = [
    {
        id: 1,
        name: "Hà Nội"
    },
    {
        id: 2,
        name: "Quảng Bình"
    },
    {
        id: 3,
        name: "Ninh Bình"
    },
    {
        id: 4,
        name: "Đà Năng"
    },
    {
        id: 5,
        name: "Sài Gòn"
    },
    {
        id: 6,
        name: "Sa Pa"
    },
    {
        id: 7,
        name: "Vũng Tàu"
    },
    {
        id: 8,
        name: "Đà Lạt"
    },
    {
        id: 9,
        name: "Nha Trang"
    },
    {
        id: 10,
        name: "Phan Thiết"
    }
];
const locationGenerate = async (req, res) => {
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
    const createResult = await prisma.location.createMany({
        data: locationsData,
        skipDuplicates: true
    });
    res.status(200).json({
        insertCount: createResult.count
    });
};
export default locationGenerate;
export { locationsData };
