import { NextFunction, Request, Response } from "express";
import { TaskValidation } from "../validations/task.validations";

export class TaskMiddleware {
  private readonly taskValidation;
  constructor() {
    this.taskValidation = new TaskValidation();
  }
  private handleValidationError(res: Response, error: any) {
    return res.status(400).json({
      message: "Error de validación",
      details: error.details.map((d: any) => d.message),
    });
  }
  saveOne = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.taskValidation.saveOne(req.body);
    req
    if (error) {
      return this.handleValidationError(res, error);
    }
    return next();
  };

  updateOneOrFail = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.taskValidation.updateOneOrFail(req.body);
    if (error) {
      return this.handleValidationError(res, error);
    }
    return next();
  };
}
