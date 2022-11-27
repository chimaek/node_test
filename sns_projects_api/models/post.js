const Sequelize = require("sequelize");
const User = require("./user");
const Hashtag = require("./hashtag");
module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: "true",
        tableName: "posts",
        modelName: "Post",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: false,
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
  }
};
