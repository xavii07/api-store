import { Request, Response } from "express";
import path from "node:path";
import fs from "node:fs";

export class ImageController {
  getImage = (req: Request, res: Response) => {
    const { type = "", img = "" } = req.params;

    const imagePath = path.resolve(
      __dirname,
      `../../../uploads/${type}/${img}`
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).send("Image not found");
    }

    res.sendFile(imagePath);
  };
}
