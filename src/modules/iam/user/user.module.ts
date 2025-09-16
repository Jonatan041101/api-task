import { Router } from "express";
import { UserController } from "./interface/user.controller";
import { UserService } from "./application/services/user.service";
import { UserFirebaseRepository } from "./infrastructure/database/user.firebase.repository";
import { IDatabase } from "@/common/base/application/database.interface";

const router = Router();

export class UserModule{
     userRepository:UserFirebaseRepository;
     userService: UserService;
     userController: UserController;
     constructor(db:IDatabase){
        this.userRepository = new UserFirebaseRepository(db);
        this.userService = new UserService(this.userRepository);
        this.userController = new UserController(this.userService);
     }

     getRouter(){
        router.get("/currentUser", this.userController.getCurrentUser);
        return router
     }
}
