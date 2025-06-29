import express, { Request, Response } from 'express';
import { prisma } from '../../../server';

const userData: {
  id: number;
  Name: string;
  email: string;
  phone: string | null;
  uuid: string
}[] = [
    { "Name": "lvaisey0", "id": 1, "email": "rnecrews0@blogs.com", "phone": "591-441-4199", "uuid": "fake||1AH9N759nfoHTkXAig2L2GogtCrLFA27wY" },
    { "Name": "ffebvre1", "id": 2, "email": "spattison1@phoca.cz", "phone": "316-980-0179", "uuid": "fake||1Bo2KMxEN1Qy4kCSSfLmWMuh4FBoBfjETD" },
    { "Name": "abutland2", "id": 3, "email": "sivison2@google.it", "phone": null, "uuid": "fake||1UrAoJJyMXshQ2krbAzj4AjhBu8snZbX7" },
    { "Name": "kwilfing3", "id": 4, "email": "jpenberthy3@princeton.edu", "phone": null, "uuid": "fake||1KivKv9T27FRxeFFfaTevB7Kh31NVZ2qB6" },
    { "Name": "rstaite4", "id": 5, "email": "cbramsom4@wp.com", "phone": "300-395-6707", "uuid": "fake||1MrCEk4RKun9jrTTqb7JPdKPeHLy5sSUXU" },
    { "Name": "thallifax5", "id": 6, "email": "cfeilden5@indiatimes.com", "phone": "271-947-4218", "uuid": "fake||1NQPzboEyJxNkm1rNeFZ6ZibSBnfRsm2v3" },
    { "Name": "cthemann6", "id": 7, "email": "soglevie6@networksolutions.com", "phone": "863-211-1826", "uuid": "fake||18s1rgJ83yuVz2pBy9dfZmfiyZjBGjoCEN" },
    { "Name": "amaccleay7", "id": 8, "email": "rbotha7@homestead.com", "phone": "570-343-4603", "uuid": "fake||14BqJzu6yBqiHnEfyVU4C5r6sc2J73ij5h" }
  ]

const usersGenerate = async (req: Request, res: Response) => {
  if (req.query && req.query.password && req.query.password === "vexere123") {
    await prisma.$connect();
    const inserted = await prisma.user.createMany({
      data: userData,
      skipDuplicates: true
    });

    res.status(200).json({
      usersCreated: inserted.count
    });
    return;
  }

  res.status(200).json({
    error: "Wrong queuery params"
  })
}

export default usersGenerate