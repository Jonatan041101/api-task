import { Router } from "express";
import { IDatabase } from "@/common/base/application/database.interface";
import { AuthenticationController } from "./interface/authentication.controller";
import { FirebaseAuthService } from "./infrastructure/firebase/firebase.service";
import {auth} from "firebase-admin"
import { AuthenticationMiddleware } from "./application/middleware/authentication.middleware";
const router = Router();

export class AuthenticationModule{
     authenticationController: AuthenticationController;
     authenticationService:FirebaseAuthService;
     authenticationMiddleware:AuthenticationMiddleware
     constructor(db:IDatabase,auth:auth.Auth){
        this.authenticationService = new FirebaseAuthService(auth);
        this.authenticationMiddleware = new AuthenticationMiddleware(auth)
        this.authenticationController = new AuthenticationController(this.authenticationService);
     }

     getRouter(){
        router.post("/", this.authenticationController.login);
        return router
     }
}
