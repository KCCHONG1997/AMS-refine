const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    console.log('Setting up database...');
    
    // First connect as root to create database and user
    let connection;
    try {
        // Try to connect as root (you may need to enter root password)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: 'root',
            password: '', // You may need to update this with your root password
        });
        
        console.log('Connected as root');
        
        // Create database
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database '${process.env.DB_NAME}' created or already exists`);
        
        // Create user if doesn't exist
        try {
            await connection.execute(`CREATE USER '${process.env.DB_USER}'@'localhost' IDENTIFIED BY '${process.env.DB_PWD}'`);
            console.log(`User '${process.env.DB_USER}' created`);
        } catch (err) {
            if (err.code === 'ER_CANNOT_USER') {
                console.log(`User '${process.env.DB_USER}' already exists`);
            } else {
                throw err;
            }
        }
        
        // Grant privileges
        await connection.execute(`GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME}\`.* TO '${process.env.DB_USER}'@'localhost'`);
        await connection.execute('FLUSH PRIVILEGES');
        console.log('Privileges granted');
        
        await connection.end();
        
        // Now connect with the new user and set up tables
        const userConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB_NAME
        });
        
        console.log('Connected with application user');
        
        // Import the Sequelize models to create tables
        const { sequelize } = require('./models');
        
        // Sync all models (create tables)
        await sequelize.sync({ force: false }); // Use force: true to recreate tables
        console.log('All models synchronized');
        
        await userConnection.end();
        console.log('Database setup completed successfully!');
        
    } catch (error) {
        console.error('Database setup failed:', error.message);
        if (connection) {
            await connection.end();
        }
        
        // If root connection failed, provide instructions
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n=== MANUAL SETUP REQUIRED ===');
            console.log('Please run these commands in MySQL Workbench or command line:');
            console.log(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
            console.log(`CREATE USER '${process.env.DB_USER}'@'localhost' IDENTIFIED BY '${process.env.DB_PWD}';`);
            console.log(`GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME}\`.* TO '${process.env.DB_USER}'@'localhost';`);
            console.log('FLUSH PRIVILEGES;');
            console.log('\nThen run: npm run setup-db-tables');
        }
    }
}

if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;
