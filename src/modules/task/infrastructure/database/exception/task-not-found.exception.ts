import { NotFoundException } from "@/common/base/infrastructure/database/exception/not-found.exception";

export class TaskNotFoundException extends NotFoundException {
  constructor(id:string){
   super(`La tarea con UUID ${id} no fue encontrada`)
  }
}