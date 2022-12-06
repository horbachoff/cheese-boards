const { db } = require('../db');
const { Sequelize } = require('sequelize');

const Board = db.define('board', {
    type: Sequelize.STRING,
    description: Sequelize.STRING,
    rating: Sequelize.NUMBER
});

module.exports = { Board };