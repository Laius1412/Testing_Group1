import { prisma as myPrisma } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";
const getBusAdminHandler = async (req) => {
    const page = singleIntQueryHandler(req.query.page, 0);
    await myPrisma.$connect();
    const buses = await myPrisma.bus.findMany({
        take: 30,
        skip: 30 * page,
        include: {
            BusHouse: {
                select: { Name: true }
            }
        }
    });
    return buses;
};
const addBusAdminHandler = async (req) => {
    const { plate, seatAmount, type, busHouse } = req.body;
    console.log(req.body);
    if (!(plate && seatAmount >= 0 && type >= 0 && busHouse >= 0)) {
        return null;
    }
    await myPrisma.$connect();
    try {
        const newBus = await myPrisma.bus.create({
            data: {
                plate: plate,
                seatAmount: seatAmount,
                type: type,
                busHouse: busHouse,
            },
        });
        return newBus;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
const updateBusAdminHanlder = async (req) => {
    const { plate, seatAmount, type, busId, house } = req.body;
    if (!(plate && seatAmount && type)) {
        return null;
    }
    try {
        await myPrisma.$connect();
        const newBus = await myPrisma.bus.update({
            where: {
                id: busId,
            },
            data: {
                plate: plate,
                seatAmount: seatAmount,
                type: type,
                busHouse: house
            }
        });
        return newBus;
    }
    catch (error) {
    }
    return null;
};
const deleteBusAdminHanlder = async (req) => {
    try {
        await myPrisma.$connect();
        const deletedBus = await myPrisma.bus.delete({
            where: {
                id: req.body.busId,
            },
        });
        return deletedBus;
    }
    catch (error) { }
    return null;
};
const busAdminHandler = async (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
        res.redirect("/login");
        return;
    }
    switch (req.method) {
        case "GET": {
            const buses = await getBusAdminHandler(req);
            res.status(200).json(buses);
            return;
        }
        case "POST": {
            const newBus = await addBusAdminHandler(req);
            if (newBus) {
                res.status(200).json(newBus);
            }
            else {
                res.status(400).json(null);
            }
            return;
        }
        case "PUT": {
            const updated = await updateBusAdminHanlder(req);
            if (updated) {
                res.status(200).json(updated);
            }
            else {
                res.status(400).json(null);
            }
            return;
        }
        case "DELETE": {
            const deleted = await deleteBusAdminHanlder(req);
            if (deleted) {
                res.status(200).json(deleted);
            }
            else {
                res.status(400).json(null);
            }
            return;
        }
    }
    res.status(404).json(null);
};
export default busAdminHandler;
