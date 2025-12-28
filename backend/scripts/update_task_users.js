const sequelize = require('../config/database');
const Task = require('../models/Task');
const User = require('../models/User');

async function updateTaskUserIds() {
    try {
        await sequelize.authenticate();
        
        const user = await User.findOne();
        if (!user) {
            console.log('No users found. Cannot update tasks.');
            return;
        }

        console.log(`Updating all tasks to userId ${user.id} (${user.email})...`);
        const result = await Task.update({ userId: user.id }, { where: {} });
        console.log(`Updated ${result[0]} tasks.`);
    } catch (error) {
        console.error('Error updating tasks:', error);
    } finally {
        await sequelize.close();
    }
}

updateTaskUserIds();
