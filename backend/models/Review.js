// models/Review.js
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'accounts',
                key: 'email'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        tableName: 'reviews'
    });

    Review.associate = (models) => {
        Review.belongsTo(models.Account, {
            as: 'account',
            foreignKey: 'email',
            targetKey: 'email',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Review;
};
