import { IDatabase } from "@/common/base/application/database.interface";
import { ICreateTaskDto } from "../../application/dto/create-task.dto.interface";
import { Task } from "../../domain/task.domain";
import { IUpdateTaskDto } from "../../application/dto/update-task.dto.interface";
import { TaskNotFoundException } from "./exception/task-not-found.exception";
import { TaskMapper } from "../../application/mapper/task.mapper";
import { randomUUID } from "node:crypto";
import { ITaskRepository } from "../../application/repository/task.repository.interface";

export class TaskFirebaseRepository implements ITaskRepository {
  private readonly collectionName = "task";
  private readonly taskMapper: TaskMapper;
  private readonly taskRef: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >;
  constructor(private readonly repository: IDatabase) {
    this.taskRef = this.repository.collection(this.collectionName);
    this.taskMapper = new TaskMapper();
  }
  async getAll(userUid:string): Promise<Task[]> {
    const snapshotTasks = await this.taskRef.where("userUid","==",userUid).get();
    return snapshotTasks.docs.map((doc: any) =>
      this.taskMapper.fromResponseFirestoreToTask(doc.data(), doc.id)
    );
  }

  async getOneByIdOrFail(uuid: string): Promise<Task> {
    try {
      const task = await this.taskRef.where("uuid", "==", uuid).get();
      if (task.empty) {
        throw new TaskNotFoundException(uuid);
      }

      return this.taskMapper.fromResponseFirestoreToTask(
        task.docs[0],
        task.docs[0].id
      );
    } catch (error) {
      throw error;
    }
  }

  async saveOne(createTaskDto: ICreateTaskDto,userUid:string): Promise<Task> {
    const taskCreated = await this.taskRef.add({
      title: createTaskDto.title,
      description: createTaskDto.description,
      isCompleted: createTaskDto.isCompleted ?? false,
      uuid: randomUUID(),
      createdAt: new Date().toISOString(),
      userUid
    });
    const task = await taskCreated.get();
    return this.taskMapper.fromResponseFirestoreToTask(task.data(), task.id);
  }

  async updateOneOrFail(
    uuid: string,
    updateTaskDto: IUpdateTaskDto
  ): Promise<Task> {
    const task = await this.getOneByIdOrFail(uuid);
    const taskUpdated = this.taskRef.doc(task?.id ?? "");

    await taskUpdated.set(updateTaskDto, { merge: true });
    return await this.getOneByIdOrFail(uuid);
  }

  async deleteOneOrFail(uuid: string,):Promise<void>{
    const task = await this.getOneByIdOrFail(uuid);
    const taskDeleted = this.taskRef.doc(task?.id ?? "");
    await taskDeleted.delete()
  }
}
