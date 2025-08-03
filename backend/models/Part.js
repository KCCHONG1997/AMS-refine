module.exports = (sequelize, DataTypes) => {
  const Part = sequelize.define('Part', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    partName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    partNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'parts',
    timestamps: true
  });

  Part.associate = (models) => {
    Part.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    Part.hasMany(models.CartItem, {
      foreignKey: 'partId',
      as: 'cartItems'
    });
  };

  return Part;
};
