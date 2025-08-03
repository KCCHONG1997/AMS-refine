const { sequelize } = require('./models');
require('dotenv').config();

async function setupTables() {
    try {
        console.log('Setting up database tables...');
        
        // Test connection
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        // Sync all models (create tables)
        await sequelize.sync({ force: false }); // Set to true to recreate tables
        console.log('All models synchronized successfully!');
        
        // Close connection
        await sequelize.close();
        console.log('Database connection closed.');
        
    } catch (error) {
        console.error('Unable to setup tables:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    setupTables();
}

module.exports = setupTables;
