import { createTaskSchema } from "./create-task.schema.validation";

export const updateTaskSchema = createTaskSchema.fork(
    ['title', 'description', 'isCompleted'],
    (schema) => schema.optional() 
);