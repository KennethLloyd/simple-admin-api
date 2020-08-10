const { Sequelize } = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(config.get('dbURI'), {
    username: config.get('dbUser'),
    password: config.get('dbPassword')
});

module.exports = sequelize;
