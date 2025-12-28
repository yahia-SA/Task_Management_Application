const sequelize = require('../config/database');
const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

async function seedTasks() {
    try {
        await sequelize.authenticate();
        
        const email = 'yahiasamir70@gmail.com';
        let user = await User.findOne({ where: { email } });

        if (user) {
            console.log(`User already exists: ${user.email} (ID: ${user.id})`);
        } else {
            const hashedPassword = await bcrypt.hash('Ya@12345678', 10);
            user = await User.create({
                name: 'yahia samir',
                email: email,
                password: hashedPassword
            });
            console.log(`Created user: ${user.email} (ID: ${user.id})`);
        }

        console.log(`Created user: ${user.email} (ID: ${user.id})`);

        const tasks = [];
        for (let i = 1; i <= 15; i++) {
            let status = 'pending';
            if (i % 3 === 0) status = 'in_progress';
            if (i % 5 === 0) status = 'done';
            
            tasks.push({
                title: `Task ${i}`,
                description: `Description for task ${i}`,
                status: status,
                userId: user.id
            });
        }

        await Task.bulkCreate(tasks);
        console.log('Seeded 15 tasks successfully.');

    } catch (error) {
        console.error('Error seeding tasks:', error);
    } finally {
        await sequelize.close();
    }
}

seedTasks();
