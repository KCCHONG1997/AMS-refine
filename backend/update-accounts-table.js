const bcrypt = require('bcrypt');
const { Account, sequelize } = require('./models');

async function updateAccountsTable() {
    try {
        console.log('Updating accounts table to include firstName and lastName...');
        
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        // Force sync to recreate the accounts table with new columns
        await Account.sync({ alter: true });
        console.log('Accounts table updated with new columns.');
        
        // Update existing accounts with names
        const adminPassword = await bcrypt.hash('admin123', 10);
        const customerPassword = await bcrypt.hash('customer123', 10);
        
        // Update or create admin account
        await Account.upsert({
            id: 1,
            email: 'admin@ams.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
        });
        
        // Update or create customer accounts with proper names
        const customers = [
            { email: 'customer@test.com', firstName: 'Test', lastName: 'Customer' },
            { email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
            { email: 'sarah.johnson@gmail.com', firstName: 'Sarah', lastName: 'Johnson' },
            { email: 'michael.chen@outlook.com', firstName: 'Michael', lastName: 'Chen' },
            { email: 'emma.williams@yahoo.com', firstName: 'Emma', lastName: 'Williams' },
            { email: 'david.brown@hotmail.com', firstName: 'David', lastName: 'Brown' },
            { email: 'lisa.martinez@gmail.com', firstName: 'Lisa', lastName: 'Martinez' },
            { email: 'james.taylor@outlook.com', firstName: 'James', lastName: 'Taylor' },
            { email: 'rachel.davis@gmail.com', firstName: 'Rachel', lastName: 'Davis' },
            { email: 'kevin.wilson@yahoo.com', firstName: 'Kevin', lastName: 'Wilson' }
        ];
        
        for (const customer of customers) {
            await Account.upsert({
                email: customer.email,
                password: customerPassword,
                firstName: customer.firstName,
                lastName: customer.lastName,
                role: 'customer'
            });
            console.log(`✅ Updated/created: ${customer.firstName} ${customer.lastName}`);
        }
        
        const totalAccounts = await Account.count();
        const totalCustomers = await Account.count({ where: { role: 'customer' } });
        
        console.log('\n🎉 Accounts table updated successfully!');
        console.log(`📊 Total accounts: ${totalAccounts}`);
        console.log(`👥 Total customers: ${totalCustomers}`);
        console.log('\n🚀 Your admin dashboard should now display customer names properly!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error updating accounts table:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    updateAccountsTable();
}

module.exports = updateAccountsTable;
