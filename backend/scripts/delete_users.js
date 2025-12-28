const sequelize = require('../config/database');
const User = require('../models/User');
const Task = require('../models/Task');

async function deleteUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully.');

        // Verify models are loaded (sync is usually done in server.js but good to be sure if we run standalone)
        // However, we just want to delete data. 

        console.log('Deleting all tasks...');
        await Task.destroy({ where: {}, truncate: false }); // truncate: false is safer with sqlite foreign keys sometimes, but let's try standard destroy first to ensure hooks run if any

        console.log('Deleting all users...');
        await User.destroy({ where: {}, truncate: false });

        console.log('Successfully deleted all users and tasks.');

    } catch (error) {
        console.error('Error deleting users:', error);
    } finally {
        await sequelize.close();
    }
}

deleteUsers();
