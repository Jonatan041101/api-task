import { Task } from "../../domain/task.domain";
import { ResponseTaskDto } from "../dto/response-task.dto.interface";

export class TaskMapper {
  fromCreateTaskDtoToTask() {}

  fromTaskToResponseTaskDto(task:Task) {
     const responseTaskDto = new ResponseTaskDto()
     responseTaskDto.uuid = task.uuid
     responseTaskDto.description = task.description
     responseTaskDto.title = task.title
     responseTaskDto.createdAt = task.createdAt
     responseTaskDto.isCompleted = task.isCompleted
     return responseTaskDto
  }

  fromResponseFirestoreToTask(
    responseFirestore: FirebaseFirestore.DocumentData|undefined,
    id: string
  ) {
    const task = new Task();

    task.id = id;
    task.description = responseFirestore?.description;
    task.uuid = responseFirestore?.uuid;
    task.title = responseFirestore?.title;
    task.createdAt = responseFirestore?.createdAt;
    return task;
  }
}
