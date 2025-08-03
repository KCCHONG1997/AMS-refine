// models/Account.js
module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer'),
            allowNull: false,
            defaultValue: 'customer'
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        tableName: 'accounts'  // maps this model to the "accounts" table
    });
    return Account;
};
