import { Request, Response } from "express";
import { UserService } from "../application/services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}
  getCurrentUser(req: Request, res: Response) {
    const user = this.userService.getCurrentUser(req.body.email);
    res.json(user);
  }
}
