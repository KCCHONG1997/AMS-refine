module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        destination: {
            type: DataTypes.STRING(100)
        },
        hotspots: {
            type: DataTypes.JSON
        },
        lines: {
            type: DataTypes.JSON
        },
        textBoxes: {
            type: DataTypes.JSON
        },
        image: {
            type: DataTypes.STRING // store image file path or URL
        }
        // TODO: Add these fields back when database migration is complete
        // displacement: {
        //     type: DataTypes.STRING
        // },
        // year: {
        //     type: DataTypes.STRING
        // },
        // modelCode: {
        //     type: DataTypes.STRING
        // },
        // colorCode: {
        //     type: DataTypes.STRING
        // },
        // colors: {
        //     type: DataTypes.JSON // Array of color names
        // },
        // colourImages: {
        //     type: DataTypes.JSON // Array of color image paths
        // }
    }, {
        tableName: 'products'
    });

    Product.associate = (models) => {
    Product.hasMany(models.Part, {
        foreignKey: 'productId',
        as: 'parts'
    });
    };

    return Product;
};
