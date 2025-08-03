module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    email: {
      type: DataTypes.STRING(100),
      primaryKey: true,  // composite PK part 1
      allowNull: false
    },
    partId: {
      type: DataTypes.INTEGER,
      primaryKey: true,  // composite PK part 2
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.part ? this.part.partName : null;
      }
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }

  }, {
    tableName: 'cart_items',
    timestamps: true
  });

  CartItem.associate = (models) => {
    // Association with Part
    CartItem.belongsTo(models.Part, { 
      foreignKey: 'partId', 
      as: 'part' 
    });

    // Association with Account
    CartItem.belongsTo(models.Account, {
      foreignKey: 'email',
      targetKey: 'email',
      as: 'user'
    });
  };

  return CartItem;
};