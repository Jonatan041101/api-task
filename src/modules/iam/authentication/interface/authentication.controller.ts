import { Request, Response } from "express";
import { FirebaseAuthService } from "../infrastructure/firebase/firebase.service";

export class AuthenticationController {
  constructor(private readonly authenticationService: FirebaseAuthService) {}
  login = async (req: Request, res: Response) => {
    await this.authenticationService.login(req.body);
    res.json({
      message: "Link de session enviado porfavor revise su correo",
      success: true,
    });
  };
}
