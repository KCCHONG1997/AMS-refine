const { Account, Review, Order, sequelize } = require('./models');

async function addCustomerData() {
    try {
        console.log('Adding reviews and orders for customers...');
        
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        // Get all customer accounts
        const customers = await Account.findAll({ where: { role: 'customer' } });
        console.log(`Found ${customers.length} customers`);
        
        // Add some reviews from different customers
        const reviewsData = [
            {
                email: 'sarah.johnson@gmail.com',
                rating: 5,
                content: 'Amazing product! The smart home integration works flawlessly. Highly recommended!'
            },
            {
                email: 'michael.chen@outlook.com',
                rating: 4,
                content: 'Great build quality and fast shipping. Setup was easier than expected.'
            },
            {
                email: 'emma.williams@yahoo.com',
                rating: 3,
                content: 'Good product overall, but the instructions could be clearer. Works as described.'
            },
            {
                email: 'david.brown@hotmail.com',
                rating: 5,
                content: 'Exceeded my expectations! Customer service was also very helpful.'
            },
            {
                email: 'lisa.martinez@gmail.com',
                rating: 4,
                content: 'Solid product with good value for money. Would buy again.'
            },
            {
                email: 'james.taylor@outlook.com',
                rating: 2,
                content: 'Had some issues with connectivity. Product works but took time to set up properly.'
            },
            {
                email: 'rachel.davis@gmail.com',
                rating: 5,
                content: 'Perfect for my IoT setup! The sensor accuracy is impressive.'
            },
            {
                email: 'kevin.wilson@yahoo.com',
                rating: 4,
                content: 'Good quality hardware. Packaging was excellent and delivery was fast.'
            }
        ];
        
        // Add reviews
        let reviewCount = 0;
        for (const reviewData of reviewsData) {
            try {
                await Review.create(reviewData);
                console.log(`✅ Added review from: ${reviewData.email}`);
                reviewCount++;
            } catch (error) {
                console.log(`❌ Failed to add review from ${reviewData.email}: ${error.message}`);
            }
        }
        
        // Add some mock orders to give customers different "order counts"
        const ordersData = [
            {
                orderId: 2001,
                firstName: 'Sarah',
                lastName: 'Johnson',
                contactNumber: '555-0001',
                email: 'sarah.johnson@gmail.com',
                status: 'completed'
            },
            {
                orderId: 2002,
                firstName: 'Sarah',
                lastName: 'Johnson',
                contactNumber: '555-0001',
                email: 'sarah.johnson@gmail.com',
                status: 'completed'
            },
            {
                orderId: 2003,
                firstName: 'Sarah',
                lastName: 'Johnson',
                contactNumber: '555-0001',
                email: 'sarah.johnson@gmail.com',
                status: 'pending'
            },
            {
                orderId: 2004,
                firstName: 'Michael',
                lastName: 'Chen',
                contactNumber: '555-0002',
                email: 'michael.chen@outlook.com',
                status: 'completed'
            },
            {
                orderId: 2005,
                firstName: 'Michael',
                lastName: 'Chen',
                contactNumber: '555-0002',
                email: 'michael.chen@outlook.com',
                status: 'completed'
            },
            {
                orderId: 2006,
                firstName: 'Emma',
                lastName: 'Williams',
                contactNumber: '555-0003',
                email: 'emma.williams@yahoo.com',
                status: 'completed'
            },
            {
                orderId: 2007,
                firstName: 'David',
                lastName: 'Brown',
                contactNumber: '555-0004',
                email: 'david.brown@hotmail.com',
                status: 'completed'
            },
            {
                orderId: 2008,
                firstName: 'David',
                lastName: 'Brown',
                contactNumber: '555-0004',
                email: 'david.brown@hotmail.com',
                status: 'pending'
            },
            {
                orderId: 2009,
                firstName: 'Lisa',
                lastName: 'Martinez',
                contactNumber: '555-0005',
                email: 'lisa.martinez@gmail.com',
                status: 'completed'
            },
            {
                orderId: 2010,
                firstName: 'James',
                lastName: 'Taylor',
                contactNumber: '555-0006',
                email: 'james.taylor@outlook.com',
                status: 'completed'
            }
        ];
        
        // Add orders
        let orderCount = 0;
        for (const orderData of ordersData) {
            try {
                await Order.create(orderData);
                console.log(`✅ Added order for: ${orderData.firstName} ${orderData.lastName}`);
                orderCount++;
            } catch (error) {
                console.log(`❌ Failed to add order for ${orderData.email}: ${error.message}`);
            }
        }
        
        // Get final counts
        const totalReviews = await Review.count();
        const totalOrders = await Order.count();
        const totalCustomers = await Account.count({ where: { role: 'customer' } });
        
        console.log(`\n🎉 Customer data added successfully!`);
        console.log(`📊 Database now contains:`);
        console.log(`- ${totalCustomers} customers`);
        console.log(`- ${totalReviews} reviews`);
        console.log(`- ${totalOrders} orders`);
        console.log(`\n🚀 Your admin dashboard will now show:`);
        console.log(`- Top 5 customers with different order counts`);
        console.log(`- More diverse review data with different ratings`);
        console.log(`- More realistic analytics and insights`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error adding customer data:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addCustomerData();
}

module.exports = addCustomerData;
