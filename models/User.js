const { db } = require('../db');
const { Sequelize } = require('sequelize');

const User = db.define('user', {
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = { User };