import { Task } from "../../domain/task.domain";
import { ICreateTaskDto } from "../dto/create-task.dto.interface";
import { IUpdateTaskDto } from "../dto/update-task.dto.interface";

export interface ITaskRepository{
    saveOne(createTaskDto:ICreateTaskDto,userUid:string):Promise<Task>
    updateOneOrFail(uuid:string,updateTaskDto:IUpdateTaskDto):Promise<Task>
    getAll(userUid:string):Promise<Task[]>
    deleteOneOrFail(uuid:string):Promise<void>

}