module.exports = (sequelize, DataTypes) => {
  const WebsiteContent = sequelize.define('WebsiteContent', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    /* Hero Section - Large white heading over video background */
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    /* Hero Section - Subheading (currently unused in components) */
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    /* Welcome Section - Paragraph below "Welcome to AMS" */
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    /* Welcome Section - Red underlined heading "Welcome to AMS" */
    featuredText: {
      type: DataTypes.STRING,
      allowNull: true
    },
    /* About Us Section - Paragraph text in the gray box */
    aboutText: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    missionText: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    contact: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    page: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    }
  }, {
    tableName: 'website_content',
    timestamps: true
  });

  return WebsiteContent;
};