const bcrypt = require('bcrypt');
const { 
    Product, 
    Review, 
    Account, 
    WebsiteContent,
    sequelize 
} = require('./models');

async function seedSimpleData() {
    try {
        console.log('Seeding database with essential data...');
        
        // Clear existing data
        await sequelize.sync({ force: true });
        console.log('Database synchronized (tables recreated)');
        
        // Create admin and customer accounts
        const adminPassword = await bcrypt.hash('admin123', 10);
        const customerPassword = await bcrypt.hash('customer123', 10);
        
        const adminAccount = await Account.create({
            email: 'admin@ams.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
        });
        
        const customerAccount = await Account.create({
            email: 'customer@test.com',
            password: customerPassword,
            firstName: 'Test',
            lastName: 'Customer',
            role: 'customer'
        });
        
        console.log('Created accounts');
        
        // Create sample products
        const product1 = await Product.create({
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
        });
        
        const product2 = await Product.create({
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
        });
        
        console.log('Created products');
        
        // Create sample reviews (using email as foreign key)
        await Review.create({
            email: customerAccount.email,
            rating: 5,
            content: 'Excellent product! Easy to set up and works perfectly with my smart home system.'
        });
        
        await Review.create({
            email: customerAccount.email,
            rating: 4,
            content: 'Good quality controller. Setup took a bit longer than expected but works well.'
        });
        
        await Review.create({
            email: customerAccount.email,
            rating: 2,
            content: 'Temperature readings seem inconsistent. Having connectivity issues.'
        });
        
        console.log('Created reviews');
        
        // Create website content
        await WebsiteContent.create({
            title: 'Welcome to AMS - Advanced Manufacturing Solutions',
            subtitle: 'Innovative IoT and Smart Home Solutions',
            description: 'Advanced Manufacturing Solutions provides cutting-edge IoT and smart home technology solutions.',
            featuredText: 'Welcome to AMS',
            aboutText: 'We are a leading provider of innovative technology solutions, specializing in IoT devices and smart home automation systems.',
            missionText: 'Our mission is to make advanced technology accessible and practical for everyday use.',
            contact: 'info@ams.com | 555-123-4567',
            page: 'homepage'
        });
        
        console.log('Created website content');
        
        console.log('\n✅ Database seeded successfully!');
        console.log('\n📊 Created:');
        console.log('- 2 accounts');
        console.log('- 2 products');
        console.log('- 3 reviews');
        console.log('- 3 website content items');
        
        console.log('\n🔐 Login credentials:');
        console.log('Admin: admin@ams.com / admin123');
        console.log('Customer: customer@test.com / customer123');
        
        console.log('\n🚀 Your database is now ready!');
        console.log('Your admin dashboard should now be able to connect to the database.');
        console.log('You can now start your server with: npm start');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedSimpleData();
}

module.exports = seedSimpleData;
