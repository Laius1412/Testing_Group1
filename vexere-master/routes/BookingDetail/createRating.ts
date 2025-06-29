import { Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";

interface CreateRatingBody{
  ticketId: string,
  rating:string
  comment:string
}

async function createRating (req: Request<{}, {},CreateRatingBody, {}>, res: Response) {
  const {comment} = req.body;
  const ticketId = singleIntQueryHandler(req.body.ticketId,-1);
  const rating = singleIntQueryHandler(req.body.rating,-1);


  if(!(ticketId && rating && ticketId >= 0 && rating >=0 )){
    res.redirect("/");
    return;
  }
  
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return
  }

  const userData = sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email));
  const ticket = await prisma.ticket.findFirst({
    where: {
      AND: [{ id: ticketId }, { userId: userData.id }]
    },
    include:{
      Rating:{
        select: {id:true}
      },
      RouteDetail:{
        select:{
          Bus:{
            select:{busHouse:true}
          }
        }
      }
    }
  });

  if(!ticket || ticket.Rating){
    res.redirect("/");
    return;
  }

  await prisma.$connect();
  try {
    const newRating = await prisma.rating.create({
      data:{
        ticketId: ticket.id,
        rating: rating,
        comment: comment,
        busHouseId: ticket.RouteDetail.Bus.busHouse
      }
    })
    res.redirect(`/user/ticket?ticketId=${newRating.ticketId}`);
    return;
  } catch (error) {
    console.log(error);
  }

  res.redirect("/");
}

export default createRating;