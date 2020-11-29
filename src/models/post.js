const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt for each new entry
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = Post;
