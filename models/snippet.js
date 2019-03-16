module.exports = function(sequelize, DataTypes) {
  var Snippet = sequelize.define("Snippet", {
    name: DataTypes.STRING,
    html: DataTypes.TEXT,
    css: DataTypes.TEXT,
    js: DataTypes.TEXT
  });

  Snippet.associate = function(models) {
    models.Snippet.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Snippet;
};
