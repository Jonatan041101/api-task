import { Router } from "express";
import { IDatabase } from "@/common/base/application/database.interface";
import { TaskFirebaseRepository } from "./infrastructure/database/task.firebase.repository";
import { TaskService } from "./application/services/task.service";
import { TaskController } from "./interface/task.controller";
import { TaskMiddleware } from "./application/middleware/task.middleware";
import { auth } from "firebase-admin";
import { AuthenticationMiddleware } from "../iam/authentication/application/middleware/authentication.middleware";

const router = Router();

export class TaskModule {
  taskRepository: TaskFirebaseRepository;
  taskService: TaskService;
  taskController: TaskController;
  taskMiddleware: TaskMiddleware;
  authenticationMiddleware:AuthenticationMiddleware
  constructor(db: IDatabase,auth:auth.Auth) {
    this.taskRepository = new TaskFirebaseRepository(db);
    this.taskService = new TaskService(this.taskRepository);
    this.authenticationMiddleware = new AuthenticationMiddleware(auth)
    this.taskController = new TaskController(this.taskService);
    this.taskMiddleware = new TaskMiddleware();
  }

  getRouter() {
    router.get("/",this.authenticationMiddleware.validate, this.taskController.getAll);
    router.post("/",this.authenticationMiddleware.validate, this.taskMiddleware.saveOne, this.taskController.saveOne);
    router.patch(
      "/:uuid",
      this.authenticationMiddleware.validate,
      this.taskMiddleware.updateOneOrFail,
      this.taskController.updateOneOrFail
    );
    router.delete(
      "/:uuid",
      this.authenticationMiddleware.validate,
      this.taskController.deleteOneOrFail
    );
    return router;
  }
}
