import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../server';

const busHouseData = [
  { "Name": "Mayer, Mayer and Jerde"  },
  { "Name": "Green-Murazik" },
  { "Name": "Vandervort, Crona and Boyle" }
]

const busHouseGenerate = async (req: Request, res: Response) => {
  
  if (req.query && req.query.password && req.query.password === "vexere123") {
    await prisma.$connect();
    const inserted = await prisma.busHouse.createMany({
      data: busHouseData,
      skipDuplicates: true
    });

    res.status(200).json({
      busHouseCreated: inserted.count
    });
    return;
  }

  res.status(200).json({
    error: "Wrong queuery params"
  })
}

export default busHouseGenerate;