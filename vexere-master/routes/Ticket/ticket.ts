import { TicketStatus } from "@prisma/client";
import { Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler, singleQueryHandler } from "../db/queryHandler";

interface CreateTicketBody {
  detailId: string,
  amount:string,
  comment:string
}

interface UpdateTicketBody {
  ticketId: string,
  status: TicketStatus
}

type TicketRequestBody = UpdateTicketBody & CreateTicketBody

async function createTicket(req: Request<{}, {}, TicketRequestBody, {}>, res: Response) {
  if (!req.oidc.user || !req.oidc.isAuthenticated()) {
    console.log("User haven't logged in");
    res.redirect("/");
    return;
  }

  switch (req.method) {
    case "POST": {
      const ticketData = await POST(req);

      if (!ticketData.data) {
        res.status(303).redirect(`/`);
        return;
      }

      res.status(303).redirect(`/user/ticket?ticketId=${ticketData.data.id}`);
      return;
    }
    case "PUT":{
      // const updatedTicket = await PUT(req);
    }
  }
  res.redirect("/")

}

async function POST(req: Request<{}, {}, CreateTicketBody>) {
  if (!req.oidc.user || !req.oidc.isAuthenticated()) {
    console.log("User haven't logged in");
    return {
      status: 401,
      data: null
    };
  }

  if (!req.body) {
    console.log("Req body", req.body);
    return {
      status: 404,
      data: null
    }
  }

  const detailId = singleIntQueryHandler(req.body.detailId, -1);
  const amount = singleIntQueryHandler(req.body.amount,-1);
  console.log(req.body.detailId);

  if (detailId < 0 || amount < 0) {
    console.log("Failed Id");
    return {
      status: 400,
      data: null
    }
  }

  await prisma.$connect();

  const userData = sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email));

  const detailInfo = await prisma.routeDetail.findFirst({
    where: {
      id: { equals: detailId }
    }
  });

  if (!detailInfo) {
    console.log("Cant get info")
    return {
      status: 400,
      data: null
    };
  }

  const ticketData = await prisma.ticket.create({
    data: {
      userId: userData.id,
      routeDetailId: detailInfo.id,
      amount: amount,
      comment: req.body.comment ? req.body.comment : null
    }
  })
  return {
    status: 200,
    data: ticketData
  }
}

export default createTicket;