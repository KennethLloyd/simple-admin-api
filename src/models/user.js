const { Sequelize, DataTypes } = require('sequelize');
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('firstName', value.trim());
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('lastName', value.trim());
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
      async set(value) {
        this.setDataValue('password', await bcrypt.hash(value.trim(), 8));
      },
    },
    tokens: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('tokens').split(',');
      },
      set(value) {
        this.setDataValue('tokens', value.join());
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt for each new entry
  },
);

// // Custom instance function (not arrow fxn since we will use 'this')
// userSchema.methods.generateAuthToken = async function () {
//   const user = this;

//   const token = jwt.sign({ _id: user._id.toString() }, config.get('jwtSecret'));

//   user.tokens = [...user.tokens, { token }]; // add token object to array of objects of tokens
//   await user.save();

//   return token;
// };

// userSchema.methods.toJSON = function () {
//   const user = this;
//   const userObject = user.toObject(); // get raw data without mongoose data and fxns for saving

//   // cannot do this in mongoose instance
//   delete userObject.password;
//   delete userObject.tokens;

//   return userObject;
// };

// // Custom model function
// userSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     return null;
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return null;
//   }
//   return user;
// };

// // Hash plain text password before saving
// userSchema.pre('save', async function (next) {
//   const user = this;

//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }

//   next();
// });

module.exports = User;
