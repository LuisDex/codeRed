module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Favorite.associate = function(models) {
    models.Favorite.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Favorite;
};