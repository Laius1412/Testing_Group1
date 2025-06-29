import express, { Express, Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";

interface AdminBusHouseGET{
  page:string
}
interface AdminBusHousePUT{
  busHouseId:number,
  name: string,
  desc:string,
  phone: string
}
interface AdminBusHousePOST{
  name: string
  desc:string,
  phone: string
}

type AdminBusHouseBody = AdminBusHousePOST & AdminBusHousePUT; 

async function adminBusHouseHandler(req:Request<{},{},AdminBusHouseBody,AdminBusHouseGET>,res:Response) {
  if (!req.oidc.isAuthenticated() || !req.oidc.user) {
    res.status(400).json({});
    return;
  }

  await prisma.$connect();
  const userData = (sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email)));

  if(!userData.isAdmin){
    res.status(400).json({})
    return
  }

  switch (req.method) {
    case "GET":{
      const houses = await GET(req);
      res.status(200).json(houses);
      return;
    }
    case "POST":{
      const newHouse = await POST(req);
      if(newHouse){
        res.status(200).json(newHouse);
        return
      }
      res.status(404);
      return;
    }
    case "PUT":{
      const updateHouse = await PUT(req);
      if(updateHouse){
        res.status(200).json(updateHouse);
        return;
      }
      res.status(404);
      return;
    }
  }

  res.status(400);
}

async function GET(req:Request<{},{},{},AdminBusHouseGET>){
  const page = singleIntQueryHandler(req.query.page,0);

  await prisma.$connect();
  const houses = await prisma.busHouse.findMany({
    take: 30,
    skip: 30 * page
  })
  return houses;
}

async function POST(req:Request<{},{},AdminBusHousePOST,{}>) {
  const {name,desc,phone} = req.body;
  await prisma.$connect();
  try {
    const newBusHouse = await prisma.busHouse.create({
      data:{
        Name: name,
        Desc: desc,
        Phone: phone
      }
    }) 
    return newBusHouse
  } catch (error) {console.log(error);}

  return null;
}

async function PUT(req:Request<{},{},AdminBusHousePUT,{}>) {
  const {busHouseId,name,desc,phone} = req.body;

  await prisma.$connect();
  try {
    const update = await prisma.busHouse.update({
      where:{
        id: busHouseId
      },
      data:{
        Name: name,
        Desc: desc,
        Phone: phone
      }
    })
    return update;
  } catch (error) {console.log(error);}
  return null;
}

export default adminBusHouseHandler;