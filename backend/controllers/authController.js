const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { z } = require('zod');

exports.register = async (req, res) => {
    try {
        // Zod Validation
        const validatedData = registerSchema.parse(req.body);

        // Check for existing email explicitly for better error message
        const existingUser = await User.findOne({ where: { email: validatedData.email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const user = await User.create({ 
            name: validatedData.name, 
            email: validatedData.email, 
            password: hashedPassword 
        });
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        // Zod Validation
        const validatedData = loginSchema.parse(req.body);

        const user = await User.findOne({ where: { email: validatedData.email } });
        if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
            throw new Error('Invalid login credentials');
        }
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(400).json({ error: error.message });
    }
};
