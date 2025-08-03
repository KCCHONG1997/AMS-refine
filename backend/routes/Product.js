const express = require('express');
const router = express.Router();
const { Product, Part, sequelize } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');

// Mock data for now
const mockProducts = [
  { id: 1, title: 'Sample Product 1', description: 'Description 1', price: 99.99 },
  { id: 2, title: 'Sample Product 2', description: 'Description 2', price: 149.99 },
  { id: 3, title: 'Sample Product 3', description: 'Description 3', price: 199.99 }
];

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fs = require('fs');
        const uploadPath = path.join(__dirname, '..', '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Helper to add imageUrl to product(s)
function addImageUrl(product, req) {
    if (!product) return product;
    const plain = product.toJSON ? product.toJSON() : product;
    if (plain.image) {
        plain.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${plain.image}`;
    } else {
        plain.imageUrl = '';
    }
    return plain;
}

// GET /api/products - Get all products or filter by destination
router.get('/', (req, res) => {
    try {
        const { destination } = req.query;
        
        let products = mockProducts;
        if (destination) {
            products = mockProducts.filter(p => p.destination === destination);
        }

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/check-title - Check if title already exists
router.get('/check-title', async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ error: 'Title parameter is required' });
        }
        
        const existingProduct = await Product.findOne({ where: { title } });
        res.json({ exists: !!existingProduct });
    } catch (error) {
        console.error('Error checking title:', error);
        res.status(500).json({ error: 'Failed to check title' });
    }
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(addImageUrl(product, req));
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST /api/products - Create new product
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'colourImage0', maxCount: 1 },
    { name: 'colourImage1', maxCount: 1 },
    { name: 'colourImage2', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            destination,
            hotspots,
            lines,
            textBoxes,
            // Country-specific fields
            displacement,
            year,
            modelCode,
            colorCode,
            colors
        } = req.body;

        console.log('Received product data:', req.body);
        console.log('Received files:', req.files);

        let parsedHotspots = null, parsedLines = null, parsedTextBoxes = null, parsedColors = null;

        try {
            parsedHotspots = hotspots ? JSON.parse(hotspots) : null;
            parsedLines = lines ? JSON.parse(lines) : null;
            parsedTextBoxes = textBoxes ? JSON.parse(textBoxes) : null;
            parsedColors = colors ? JSON.parse(colors) : null;
        } catch (err) {
            console.error('JSON parse error:', err);
            return res.status(400).json({ error: 'Invalid JSON in one of the fields' });
        }

        // Handle colour images
        const colourImagePaths = [];
        if (req.files) {
            for (let i = 0; i < 3; i++) {
                const fieldName = `colourImage${i}`;
                if (req.files[fieldName] && req.files[fieldName][0]) {
                    colourImagePaths[i] = req.files[fieldName][0].filename;
                } else {
                    colourImagePaths[i] = null;
                }
            }
        }

        const productData = {
            title,
            description: description || '',
            price: price ? parseFloat(price) : null,
            destination,
            hotspots: parsedHotspots,
            lines: parsedLines,
            textBoxes: parsedTextBoxes,
            image: req.files && req.files.image && req.files.image[0] ? req.files.image[0].filename : null,
            // Country-specific fields
            displacement: displacement || null,
            year: year || null,
            modelCode: modelCode || null,
            colorCode: colorCode || null,
            colors: parsedColors,
            colourImages: colourImagePaths
        };

        console.log('Creating product with data:', productData);

        const product = await Product.create(productData);
        res.status(201).json({ ...addImageUrl(product, req), id: product.id });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product', details: error.message });
    }
});

// PUT /api/products/:id - Update product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const {
            title,
            description,
            price,
            destination,
            hotspots,
            lines,
            textBoxes
        } = req.body;

        const updateData = {
            title: title || product.title,
            description: description || product.description,
            price: price ? parseFloat(price) : product.price,
            destination: destination || product.destination,
            hotspots: hotspots ? JSON.parse(hotspots) : product.hotspots,
            lines: lines ? JSON.parse(lines) : product.lines,
            textBoxes: textBoxes ? JSON.parse(textBoxes) : product.textBoxes,
        };

        // Only update image if new file uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        await product.update(updateData);
        res.json(addImageUrl(product, req));
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { Part } = require('../models'); // Make sure this is imported at the top

        // Delete all parts linked to this product
        await Part.destroy({ where: { productId: product.id } });

        // Then delete the product
        await product.destroy();

        res.json({ message: 'Product and associated parts deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// POST /api/products/upload - Upload image and return URL
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the accessible URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

module.exports = router;
// (No changes needed in this backend file for removing UI sections)