const bcrypt = require('bcrypt');
const { 
    Product, 
    Review, 
    Account, 
    Order, 
    CartItem, 
    Part, 
    WebsiteContent,
    sequelize 
} = require('./models');

async function seedData() {
    try {
        console.log('Seeding database with sample data...');
        
        // Clear existing data (optional - remove if you want to keep existing data)
        await sequelize.sync({ force: true });
        console.log('Database synchronized (tables recreated)');
        
        // Create admin and customer accounts
        const adminPassword = await bcrypt.hash('admin123', 10);
        const customerPassword = await bcrypt.hash('customer123', 10);
        
        const accounts = await Account.bulkCreate([
            {
                email: 'admin@ams.com',
                password: adminPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin'
            },
            {
                email: 'customer@test.com',
                password: customerPassword,
                firstName: 'Test',
                lastName: 'Customer',
                role: 'customer'
            },
            {
                email: 'john@example.com',
                password: customerPassword,
                firstName: 'John',
                lastName: 'Doe',
                role: 'customer'
            }
        ]);
        console.log('Created accounts');
        
        // Create sample products
        const products = await Product.bulkCreate([
            {
                title: 'Smart Home Controller',
                description: 'Advanced smart home automation controller with WiFi connectivity',
                price: 299.99,
                destination: '/products/smart-controller',
                hotspots: JSON.stringify([
                    { x: 100, y: 50, info: 'WiFi Module' },
                    { x: 200, y: 100, info: 'Control Panel' }
                ]),
                lines: JSON.stringify([
                    { x1: 50, y1: 50, x2: 150, y2: 100 }
                ]),
                textBoxes: JSON.stringify([
                    { x: 75, y: 25, text: 'Main Unit' }
                ]),
                image: '/images/smart-controller.jpg'
            },
            {
                title: 'IoT Sensor Hub',
                description: 'Multi-sensor IoT hub for environmental monitoring',
                price: 199.99,
                destination: '/products/iot-hub',
                hotspots: JSON.stringify([
                    { x: 80, y: 60, info: 'Temperature Sensor' },
                    { x: 150, y: 90, info: 'Humidity Sensor' }
                ]),
                lines: JSON.stringify([]),
                textBoxes: JSON.stringify([
                    { x: 100, y: 150, text: 'Sensor Array' }
                ]),
                image: '/images/iot-hub.jpg'
            },
            {
                title: 'Wireless Display Module',
                description: 'High-resolution wireless display for remote monitoring',
                price: 149.99,
                destination: '/products/display-module',
                hotspots: JSON.stringify([
                    { x: 120, y: 80, info: 'Display Screen' },
                    { x: 180, y: 120, info: 'Control Buttons' }
                ]),
                lines: JSON.stringify([
                    { x1: 100, y1: 80, x2: 180, y2: 120 }
                ]),
                textBoxes: JSON.stringify([
                    { x: 60, y: 200, text: 'Touch Interface' }
                ]),
                image: '/images/display-module.jpg'
            }
        ]);
        console.log('Created products');
        
        // Create parts for products
        const parts = await Part.bulkCreate([
            {
                productId: products[0].id,
                partName: 'WiFi Module',
                partNumber: 'WM-001',
                price: 29.99
            },
            {
                productId: products[0].id,
                partName: 'Control Panel',
                partNumber: 'CP-001',
                price: 49.99
            },
            {
                productId: products[1].id,
                partName: 'Temperature Sensor',
                partNumber: 'TS-001',
                price: 15.99
            },
            {
                productId: products[1].id,
                partName: 'Humidity Sensor',
                partNumber: 'HS-001',
                price: 18.99
            }
        ]);
        console.log('Created parts');
        
        // Create sample reviews with a mix of ratings
        const reviews = await Review.bulkCreate([
            {
                email: accounts[1].email,
                rating: 5,
                content: 'Excellent product! Easy to set up and works perfectly with my smart home system.',
                createdAt: new Date('2024-01-15')
            },
            {
                email: accounts[2].email,
                rating: 4,
                content: 'Good quality controller. Setup took a bit longer than expected but works well.',
                createdAt: new Date('2024-01-20')
            },
            {
                email: accounts[1].email,
                rating: 2,
                content: 'Temperature readings seem inconsistent. Having connectivity issues.',
                createdAt: new Date('2024-01-25')
            },
            {
                email: accounts[2].email,
                rating: 1,
                content: 'Stopped working after 2 weeks. Very disappointed with the quality.',
                createdAt: new Date('2024-02-01')
            },
            {
                email: accounts[1].email,
                rating: 4,
                content: 'Nice display quality. Touch interface is responsive.',
                createdAt: new Date('2024-02-05')
            },
            {
                email: accounts[2].email,
                rating: 3,
                content: 'Average product. Does what it says but nothing special.',
                createdAt: new Date('2024-02-10')
            }
        ]);
        console.log('Created reviews');
        
        // Create sample orders
        const orders = await Order.bulkCreate([
            {
                orderId: 1001,
                firstName: accounts[1].firstName,
                lastName: accounts[1].lastName,
                contactNumber: '555-0123',
                email: accounts[1].email,
                status: 'completed'
            },
            {
                orderId: 1002,
                firstName: accounts[2].firstName,
                lastName: accounts[2].lastName,
                contactNumber: '555-0456',
                email: accounts[2].email,
                status: 'pending'
            }
        ]);
        console.log('Created orders');
        
        // Create website content
        const websiteContent = await WebsiteContent.bulkCreate([
            {
                key: 'homepage_title',
                value: 'Welcome to AMS - Advanced Manufacturing Solutions',
                description: 'Main homepage title'
            },
            {
                key: 'homepage_subtitle',
                value: 'Innovative IoT and Smart Home Solutions',
                description: 'Homepage subtitle'
            },
            {
                key: 'contact_email',
                value: 'info@ams.com',
                description: 'Contact email address'
            },
            {
                key: 'company_address',
                value: '123 Technology Dr, Innovation City, TC 12345',
                description: 'Company address'
            }
        ]);
        console.log('Created website content');
        
        console.log('\n✅ Database seeded successfully!');
        console.log('\n📊 Created:');
        console.log(`- ${accounts.length} accounts`);
        console.log(`- ${products.length} products`);
        console.log(`- ${parts.length} parts`);
        console.log(`- ${reviews.length} reviews`);
        console.log(`- ${orders.length} orders`);
        console.log(`- ${websiteContent.length} website content items`);
        
        console.log('\n🔐 Login credentials:');
        console.log('Admin: admin@ams.com / admin123');
        console.log('Customer: customer@test.com / customer123');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedData();
}

module.exports = seedData;
