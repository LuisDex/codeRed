module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [5]
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8]
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Favorite, {
      onDelete: "CASCADE"
    });
    User.hasMany(models.Snippet, {
      onDelete: "CASCADE"
    });
  };
  return User;
};
