const bcrypt = require('bcrypt');
const { Account, sequelize } = require('./models');

async function addMoreCustomers() {
    try {
        console.log('Adding more customer accounts...');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        const customerPassword = await bcrypt.hash('customer123', 10);
        
        const newCustomers = [
            {
                email: 'sarah.johnson@gmail.com',
                password: customerPassword,
                firstName: 'Sarah',
                lastName: 'Johnson',
                role: 'customer'
            },
            {
                email: 'michael.chen@outlook.com',
                password: customerPassword,
                firstName: 'Michael',
                lastName: 'Chen',
                role: 'customer'
            },
            {
                email: 'emma.williams@yahoo.com',
                password: customerPassword,
                firstName: 'Emma',
                lastName: 'Williams',
                role: 'customer'
            },
            {
                email: 'david.brown@hotmail.com',
                password: customerPassword,
                firstName: 'David',
                lastName: 'Brown',
                role: 'customer'
            },
            {
                email: 'lisa.martinez@gmail.com',
                password: customerPassword,
                firstName: 'Lisa',
                lastName: 'Martinez',
                role: 'customer'
            },
            {
                email: 'james.taylor@outlook.com',
                password: customerPassword,
                firstName: 'James',
                lastName: 'Taylor',
                role: 'customer'
            },
            {
                email: 'rachel.davis@gmail.com',
                password: customerPassword,
                firstName: 'Rachel',
                lastName: 'Davis',
                role: 'customer'
            },
            {
                email: 'kevin.wilson@yahoo.com',
                password: customerPassword,
                firstName: 'Kevin',
                lastName: 'Wilson',
                role: 'customer'
            }
        ];
        
        // Add customers one by one to handle duplicates gracefully
        let addedCount = 0;
        for (const customerData of newCustomers) {
            try {
                // Check if customer already exists
                const existingCustomer = await Account.findOne({ 
                    where: { email: customerData.email } 
                });
                
                if (!existingCustomer) {
                    await Account.create(customerData);
                    console.log(`✅ Added customer: ${customerData.firstName} ${customerData.lastName} (${customerData.email})`);
                    addedCount++;
                } else {
                    console.log(`⚠️  Customer already exists: ${customerData.email}`);
                }
            } catch (error) {
                console.log(`❌ Failed to add ${customerData.email}: ${error.message}`);
            }
        }
        
        // Get total customer count
        const totalCustomers = await Account.count({ where: { role: 'customer' } });
        
        console.log(`\n🎉 Success!`);
        console.log(`- Added ${addedCount} new customers`);
        console.log(`- Total customers in database: ${totalCustomers}`);
        console.log(`\n💡 All new customers have the password: customer123`);
        console.log(`\n🔄 Your admin dashboard should now show more customers in the "Top 5 Customers" section!`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error adding customers:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addMoreCustomers();
}

module.exports = addMoreCustomers;
