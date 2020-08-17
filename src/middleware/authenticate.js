const jwt = require('jsonwebtoken');
const config = require('config');
const { Sequelize } = require('sequelize');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  const { Op } = Sequelize;

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findOne({
      where: {
        id: decoded.id,
        tokens: {
          [Op.like]: `%${token}%`,
        },
      },
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = authenticate;
