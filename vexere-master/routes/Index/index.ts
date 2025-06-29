import express, { Express, Request, Response } from "express";
import { prisma as prismaClient } from "../../server";



const indexHandler = async (req: Request, res: Response) => {
  
  let data = await prismaClient.location.findMany({
    select: {
      name: true,
      id: true
    }
  });

  let locations = data.map(loc => loc.name);
  
  res.locals.title = "Trang chủ";
  res.locals.locations = data;

  res.render("index");
}

export default indexHandler;