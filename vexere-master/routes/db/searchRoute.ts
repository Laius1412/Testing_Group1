import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../server';
import { singleIntQueryHandler } from './queryHandler';

async function searchRouteFromDB(fromId: number, toId: number, houses: number[], min: number, max: number, page: number = 0, date: Date, type: number = -1) {
  const itemPerPage = 8;
  await prisma.$connect();
  const route = await prisma.route.findFirst({
    select: {
      id: true,
      Location_Route_startLocIdToLocation: {
        select: { name: true }
      },
      Location_Route_endLocIdToLocation: {
        select: { name: true }
      }
    },
    where: {
      AND: [
        { startLocId: fromId },
        { endLocId: toId },
      ]
    }
  })

  if (!route) {
    return {
      route: {},
      routeDetail: [],
    };
  }

  const today = new Date();
  const tommorrow = new Date(today.getTime() + 1 * 8.64e+7)
  const routeDetail = await prisma.routeDetail.findMany({
    take: itemPerPage,
    skip: itemPerPage * page,
    orderBy:[
      {startTime:"asc"}
    ],
    where: {
      AND: [
        { startTime: { gte: date } },
        { remainSeat: { gt: 0 } },
        { routeId: route.id },
        { ...(isNaN(min) ? {} : { price: { gte: min } }) },
        { ...(isNaN(max) ? {} : { price: { lte: max } }) },
        { ...(type <= 0  ?  {} : { Bus: { type: { equals: type } } }) }
      ],
      ...((houses.length === 0) ? {} : {
        OR: [
          {
            Bus: {
              OR: [{ busHouse: { in: houses } }]
            }
          }]
      }
      )
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      price: true,
      remainSeat: true,
      Bus: {
        select: {
          type: true,
          busHouse: true,
          BusHouse: {
            select: {
              Name: true,
              id:true
            }
          }
        }
      }
    }
  })
  return {
    route: route,
    routeDetail: routeDetail
  };
}

// async function searchRouteAPI(
//   req: Request<{}, {}, {}, {
//     page?: string,
//     fromId: string,
//     toId: string
//   }, {}>,
//   res: Response) {

//   if (!(req.query && req.query.fromId && req.query.toId)) {
//     res.status(210).json([]);
//     return;
//   }

//   const page = singleIntQueryHandler(req.query.page, 0);
//   const fromId = singleIntQueryHandler(req.query.fromId);
//   const toId = singleIntQueryHandler(req.query.toId);

//   const ans = await searchRouteFromDB(fromId, toId, [],NaN,NaN, page);

//   res.json(ans);
// }

// export default searchRouteAPI;
export { searchRouteFromDB }
