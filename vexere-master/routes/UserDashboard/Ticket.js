import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";
export default async function userTicketsApi(req, res) {
    if (!req.oidc.user || !req.oidc.isAuthenticated()) {
        res.redirect("/");
        return;
    }
    const userData = sessionManager.users[req.oidc.user.sid] || await getUserFromDB(req.oidc.user.sub, req.oidc.user.email);
    const page = singleIntQueryHandler(req.query.page, 0);
    const tickets = await prisma.ticket.findMany({
        take: 30,
        skip: 30 * page,
        orderBy: [
            {
                RouteDetail: {
                    startTime: "asc"
                }
            }
        ],
        where: {
            userId: userData.id,
            ...(!req.query.status ? { OR: [
                    { status: { equals: "WAITING" } },
                    { status: { equals: "PAID" } }
                ] } : { status: { equals: req.query.status } })
        },
        select: {
            id: true,
            status: true,
            RouteDetail: {
                select: {
                    startTime: true,
                    Bus: {
                        select: {
                            plate: true,
                            BusHouse: { select: { Name: true } }
                        }
                    },
                    Route: {
                        select: {
                            Location_Route_endLocIdToLocation: { select: { name: true } },
                            Location_Route_startLocIdToLocation: { select: { name: true } }
                        },
                    }
                }
            }
        },
    });
    res.status(200).json(tickets);
}
export async function cancelTicketHandler(req, res) {
    if (!req.oidc.user || !req.oidc.isAuthenticated()) {
        res.redirect("/");
        return;
    }
    const userData = sessionManager.users[req.oidc.user.sid] || await getUserFromDB(req.oidc.user.sub, req.oidc.user.email);
    const ticketId = singleIntQueryHandler(req.body.ticketId, -1);
    if (ticketId <= 0) {
        res.redirect("/");
        return;
    }
    try {
        const ticket = await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: "CANCELED"
            }
        });
        res.redirect(`/user/ticket?ticketId=${ticket.id}`);
    }
    catch (error) {
        console.log(error);
    }
}
