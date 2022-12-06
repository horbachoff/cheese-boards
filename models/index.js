const { User } = require('./User');
const { Board } = require('./Board');
const { Cheese } = require('./Cheese');

User.hasMany(Board)
Board.belongsToMany(User)

Cheese.belongsToMany(Board, {through: 'cheese_board'})
Board.belongsToMany(Cheese, {through: 'cheese_board'})

module.exports = { User, Board, Cheese };