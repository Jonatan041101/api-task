import { Task } from "../../domain/task.domain";
import { ICreateTaskDto } from "../dto/create-task.dto.interface";
import { ResponseTaskDto } from "../dto/response-task.dto.interface";
import { IUpdateTaskDto } from "../dto/update-task.dto.interface";
import { TaskMapper } from "../mapper/task.mapper";
import { ITaskRepository } from "../repository/task.repository.interface";

export class TaskService {
  private readonly taskMapper: TaskMapper;
  constructor(private readonly taskRepository: ITaskRepository) {
    this.taskMapper = new TaskMapper();
  }

  async saveOne(createTaskDto: ICreateTaskDto,userUid:string): Promise<ResponseTaskDto> {
    const task = await this.taskRepository.saveOne(createTaskDto,userUid);
    return this.taskMapper.fromTaskToResponseTaskDto(task);
  }

  async updateOneOrFail(
    uuid: string,
    updateTaskDto: IUpdateTaskDto
  ): Promise<ResponseTaskDto> {
    const task = await this.taskRepository.updateOneOrFail(uuid, updateTaskDto);
    return this.taskMapper.fromTaskToResponseTaskDto(task);
  }

  async getAll(userUid:string): Promise<ResponseTaskDto[]> {
    const tasks = await this.taskRepository.getAll(userUid);
    return tasks.map((task) => this.taskMapper.fromTaskToResponseTaskDto(task));
  }

  async deleteOneOrFail(uuid:string):Promise<void>{
    return this.taskRepository.deleteOneOrFail(uuid)
  }
}
