module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    ref: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
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
