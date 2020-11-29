const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const sequelize = require('../db/sequelize');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('first_name', value.trim());
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('last_name', value.trim());
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      },
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt for each new entry
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

User.prototype.generateAuthToken = async function () {
  const user = this;
  const { id } = user;

  const token = jwt.sign({ id: id.toString() }, config.get('jwtSecret'));

  return token;
};

User.beforeSave(async (userInstance) => {
  if (userInstance.changed('password')) {
    userInstance.password = await bcrypt.hash(userInstance.password, 8);
  }
});

module.exports = User;
