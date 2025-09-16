import { NextFunction, Request, Response } from "express";
import { TaskService } from "../application/services/task.service";
import { AuthRequest } from "@/common/base/application/interfaces/auth.request.interface";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  saveOne = async (req: AuthRequest, res: Response): Promise<void> => {
    const task = await this.taskService.saveOne(req.body,req?.user?.uid ?? "");
    res.json(task);
  };

  updateOneOrFail = async (req: AuthRequest, res: Response): Promise<void> => {
    const task = await this.taskService.updateOneOrFail(
      req.params.uuid,
      req.body
    );
    res.json({ task });
  };

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    const tasks = await this.taskService.getAll(req.user?.uid??"");
    res.json({ tasks });
  };

  deleteOneOrFail = async (req: AuthRequest, res: Response): Promise<void> =>{
    const tasks = await this.taskService.deleteOneOrFail(req.params.uuid);

    res.json({
      success:true,
      message:`La tarea con UUID ${req.params.uuid} fue eliminada.`
    })
  }
}
