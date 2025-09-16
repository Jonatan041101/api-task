import { createTaskSchema } from "../schemas/create-task.schema.validation";
import { updateTaskSchema } from "../schemas/update-task.schema.validation";

export class TaskValidation {
  saveOne(body: any) {
    return createTaskSchema.validate(body);
  }

  updateOneOrFail(body: any) {
    return updateTaskSchema.validate(body);
  }
}
