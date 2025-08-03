const { Product, Part, sequelize } = require('./models');

async function addMoreParts() {
    try {
        console.log('Adding more parts to products...');
        
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        // Get existing products
        const products = await Product.findAll();
        console.log(`Found ${products.length} products`);
        
        if (products.length < 2) {
            console.log('❌ Need at least 2 products to add parts');
            process.exit(1);
        }
        
        // Add comprehensive parts for Smart Home Controller (Product 1)
        const smartControllerParts = [
            { partName: 'WiFi Module', partNumber: 'WM-001', price: 29.99 },
            { partName: 'Control Panel', partNumber: 'CP-001', price: 49.99 },
            { partName: 'Power Supply Unit', partNumber: 'PSU-001', price: 19.99 },
            { partName: 'Ethernet Port', partNumber: 'EP-001', price: 12.99 },
            { partName: 'LED Display', partNumber: 'LD-001', price: 24.99 },
            { partName: 'Touch Sensor', partNumber: 'TS-001', price: 18.99 },
            { partName: 'Circuit Board', partNumber: 'CB-001', price: 39.99 },
            { partName: 'Antenna Module', partNumber: 'AM-001', price: 15.99 }
        ];
        
        // Add comprehensive parts for IoT Sensor Hub (Product 2)
        const iotHubParts = [
            { partName: 'Temperature Sensor', partNumber: 'TEMP-001', price: 15.99 },
            { partName: 'Humidity Sensor', partNumber: 'HUM-001', price: 18.99 },
            { partName: 'Motion Detector', partNumber: 'MD-001', price: 22.99 },
            { partName: 'Light Sensor', partNumber: 'LS-001', price: 13.99 },
            { partName: 'Pressure Sensor', partNumber: 'PS-001', price: 25.99 },
            { partName: 'Microprocessor', partNumber: 'MP-001', price: 45.99 },
            { partName: 'Memory Module', partNumber: 'MM-001', price: 28.99 },
            { partName: 'Battery Pack', partNumber: 'BP-001', price: 35.99 },
            { partName: 'Wireless Transmitter', partNumber: 'WT-001', price: 32.99 },
            { partName: 'Protective Casing', partNumber: 'PC-001', price: 16.99 }
        ];
        
        // Clear existing parts first
        await Part.destroy({ where: {} });
        console.log('Cleared existing parts');
        
        let partCount = 0;
        
        // Add parts for Smart Home Controller
        for (const partData of smartControllerParts) {
            try {
                await Part.create({
                    productId: products[0].id,
                    ...partData
                });
                console.log(`✅ Added part: ${partData.partName} to ${products[0].title}`);
                partCount++;
            } catch (error) {
                console.log(`❌ Failed to add ${partData.partName}: ${error.message}`);
            }
        }
        
        // Add parts for IoT Sensor Hub
        for (const partData of iotHubParts) {
            try {
                await Part.create({
                    productId: products[1].id,
                    ...partData
                });
                console.log(`✅ Added part: ${partData.partName} to ${products[1].title}`);
                partCount++;
            } catch (error) {
                console.log(`❌ Failed to add ${partData.partName}: ${error.message}`);
            }
        }
        
        // Get total counts
        const totalParts = await Part.count();
        
        console.log(`\n🎉 Parts added successfully!`);
        console.log(`📊 Total parts in database: ${totalParts}`);
        console.log(`🔧 Added ${partCount} parts across ${products.length} products`);
        console.log(`\n🚀 Your admin dashboard "Top 10 Parts Required" section will now show:`);
        console.log('- WiFi Module, Control Panel, Power Supply Unit');
        console.log('- Temperature Sensor, Humidity Sensor, Motion Detector');
        console.log('- And 12+ more parts!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error adding parts:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addMoreParts();
}

module.exports = addMoreParts;
