import express, { Express, Request, Response } from "express";
import { prisma as prismaClient } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";

async function BusHouseRouteHandler(req: Request<{},{},{},{houseId:string}>, res: Response){
  const houseId = singleIntQueryHandler(req.query.houseId,NaN);
  if(isNaN(houseId)){
    res.redirect("/");
    return;
  }

  await prismaClient.$connect();
  const house = await prismaClient.busHouse.findUnique({
    where:{
      id: houseId
    },
    include:{
      Rating:{
        take: 10,
        select:{
          rating: true,
          comment: true,
          Ticket:{
            select:{
              User:{
                select:{Name:true}
              }
            }
          }
        }
      }
    }
  })


  if(house){
    res.render("house",{
      ...house,
      phones: (house.Phone) ? (house.Phone.split(",")) : null,
      intro: (house.Desc) ? (house.Desc.split("\n")) : null
    });
    return;
  }
  res.redirect("/")
}

export default BusHouseRouteHandler;