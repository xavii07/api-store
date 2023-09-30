import { UploadedFile } from "express-fileupload";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services";
import { Request, Response } from "express";

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleErrors = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const file = req.body.files.at(0) as UploadedFile;

    console.log(file);

    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then((uploaded) =>
        res
          .status(201)
          .json({ uploaded, message: "File uploaded successfully" })
      )
      .catch((error) => this.handleErrors(error, res));
  };

  uploadMultipleFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) =>
        res
          .status(201)
          .json({ uploaded, message: "Files uploaded successfully" })
      )
      .catch((error) => this.handleErrors(error, res));
  };
}
