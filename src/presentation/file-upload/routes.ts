import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const uploadService = new FileUploadService();
    const controlador = new FileUploadController(uploadService);

    router.post(
      "/single/:type",
      [
        FileUploadMiddleware.containFiles,
        TypeMiddleware.validTypes(["users", "products", "categories"]),
      ],
      controlador.uploadFile
    );

    return router;
  }
}
