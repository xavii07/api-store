import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryController } from "./controller";
import { CategoryService } from "../services";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    router.get("/", controller.getCategories);
    router.post("/", [AuthMiddleware.validateJwt], controller.createCategory);

    return router;
  }
}
