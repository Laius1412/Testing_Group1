import { Request, Response } from "express";
import { arrayIntQueryHandler, singleIntQueryHandler, singleQueryHandler } from "../db/queryHandler";
import { searchRouteFromDB } from "../db/searchRoute";
import { prisma } from "../../server";

//xe loại 1: ghế bus ngồi
//xe loại 2: xe bus giường nằm
//xe loại 3: xe Limousine

const searchRouteHandler = async (
  req: Request<{}, {}, {}, {
    page?: string,
    fromId: string,
    toId: string,
    date: string,
    busHouse?: string[],
    min?:string,
    max?:string,
    busType?: string
  }, {}>,
  res: Response) => {
  if (!(req.query && req.query.fromId && req.query.toId)) {
    console.log(req.query);
    console.log(!(req.query && req.query.fromId && req.query.toId))
    res.render("search", {});
    return;
  }

  const page = singleIntQueryHandler(req.query.page, 0);
  const min = singleIntQueryHandler(req.query.min,NaN);
  const max = singleIntQueryHandler(req.query.max,NaN);
  const type = singleIntQueryHandler(req.query.busType,-1)
  const houses = req.query.busHouse ? arrayIntQueryHandler(req.query.busHouse) : [];

  await prisma.$connect();
  const fromLoc = await prisma.location.findMany({
    take: 2,
    where: {
      OR: [
        { name: { contains: singleQueryHandler(req.query.fromId) } },
        { name: { contains: singleQueryHandler(req.query.toId) } }
      ],
    }
  })
  if (fromLoc.length !== 2) {
    res.render("search", {});
    return;
  }

  const fromId = (fromLoc[0].name.includes(req.query.fromId)) ? fromLoc[0].id : fromLoc[1].id;
  const toId =  (fromLoc[0].name.includes(req.query.toId)) ? fromLoc[0].id : fromLoc[1].id;

  const ans = await searchRouteFromDB(fromId, toId, houses,min,max,page,new Date(req.query.date),type);
  const ansHouses = [...new Map(ans.routeDetail.map(item =>
    [item.Bus.BusHouse.id, item.Bus.BusHouse])).values()];


  ans.routeDetail.forEach((detail) => {
    const expectDate = (Math.abs(detail.endTime.getTime() - detail.startTime.getTime()) / (1000 * 60 * 60));

    detail.startTime = detail.startTime.toLocaleString();
    detail.endTime = detail.endTime.toLocaleString();
    detail.expect = expectDate.toPrecision(2);
  })


  res.render("search", {
    ...ans,
    houses: ansHouses,
    date: req.query.date,
    empty: (ans.routeDetail.length === 0 ) ? true : false 
  });
}

export default searchRouteHandler;