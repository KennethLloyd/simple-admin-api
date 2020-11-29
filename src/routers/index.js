const {
  sequelizeCrud,
  crud,
  sequelizeSearchFields,
} = require('express-sequelize-crud');
const { Op } = require('sequelize');
const { User, Post } = require('../models');

module.exports = (app) => {
  app.use(crud('/users', sequelizeCrud(User)));
  app.use(
    crud('/posts', {
      ...sequelizeCrud(Post),
      search: sequelizeSearchFields(Post, ['title', 'body'], Op.like),
    }),
  );
};
