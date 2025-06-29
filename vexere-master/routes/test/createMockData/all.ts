import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../server';
const busHouseData = [
  { "Name": "Mayer, Mayer and Jerde"  },
  { "Name": "Green-Murazik" },
  { "Name": "Vandervort, Crona and Boyle" }
]

const busData = [
  { "plate": "WBAYB6C53FG161804", "seatAmount": 19, "type": 2, "busHouse": 2 },
  { "plate": "3N1AB7AP0FY078430", "seatAmount": 23, "type": 3, "busHouse": 1 },
  { "plate": "KNAFK4A67F5321976", "seatAmount": 16, "type": 1, "busHouse": 1 },
  { "plate": "2C3CCAAG5EH328818", "seatAmount": 36, "type": 3, "busHouse": 2 },
  { "plate": "5NPEB4AC8BH815567", "seatAmount": 21, "type": 1, "busHouse": 1 },
  { "plate": "5J8TB3H58EL523685", "seatAmount": 35, "type": 1, "busHouse": 1 },
  { "plate": "KNADM5A39D6068518", "seatAmount": 29, "type": 2, "busHouse": 2 },
  { "plate": "1D7RE5GK1BS454204", "seatAmount": 36, "type": 3, "busHouse": 2 }
]
const allGenerate = async (req: Request, res: Response,next:NextFunction) => {
  if (!(req.query && req.query.password && req.query.password === "vexere123")){
    res.status(404);
    next();
    return;
  }
}
