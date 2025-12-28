const Task = require('../models/Task');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');
const { z } = require('zod');

exports.createTask = async (req, res) => {
    try {
        const validatedData = createTaskSchema.parse(req.body);

        const task = await Task.create({
            title: validatedData.title,
            description: validatedData.description,
            userId: req.userId
        });
        res.status(201).json(task);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const offset = (page - 1) * limit;

        const whereClause = { userId: req.userId };
        if (status && status !== 'all') {
            whereClause.status = status;
        }

        const { count, rows } = await Task.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            data: rows,
            meta: {
                total: count,
                page: page,
                totalPages: Math.ceil(count / limit),
                limit: limit
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const validatedData = updateTaskSchema.parse(req.body);

        const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.status = validatedData.status;
        await task.save();
        res.json(task);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
