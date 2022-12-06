const { db } = require('./db');
const { Cheese, Board, User } = require('./models');
const { seedCheese, seedBoard, seedUser } = require('./seedData');

const seed = async() => {
    await db.sync({force: true});
    await Cheese.bulkCreate(seedCheese);
    await Board.bulkCreate(seedBoard);
    await User.bulkCreate(seedUser);
    console.log("Database populated with seed data");
}

seed()