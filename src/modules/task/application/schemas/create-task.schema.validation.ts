import Joi from "joi";

export const createTaskSchema  = Joi.object({
    title:Joi.string().trim().min(3).max(100).required(),
    description:Joi.string().trim().min(10).max(500).required(),
    isCompleted:Joi.boolean().optional().default(false),
})