const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    }); // search a user with this ID and this token from his array of tokens

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
