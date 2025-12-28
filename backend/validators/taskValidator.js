const { z } = require('zod');

const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional()
});

const updateTaskSchema = z.object({
    status: z.enum(['pending', 'in_progress', 'done'], {
        errorMap: () => ({ message: 'Status must be one of: pending, in_progress, done' })
    })
});

module.exports = {
    createTaskSchema,
    updateTaskSchema
};
