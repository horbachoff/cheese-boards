const { db } = require('./db');
const { Cheese, User, Board } = require('./models/index');
const { seedCheese, seedUser, seedBoard } = require('./seedData');

describe("User, Cheese and Board models", () => {
    beforeAll( async() => {
        // the 'sync' method will create tables based on the model class by setting 'force:true' the tables are recreated each time the test suite is run ...
        await db.sync({force: true});
    })

    // Testing CREATE from CRUD
    test ('if it can create a User', async () => {
        const user = await User.create({name: 'Yegor', email: "yegor.email.com"});
        expect(user).toBeDefined();
        expect(user.name).toBe('Yegor')
        expect(user.email).toBe("yegor.email.com")
    })

    test ('if it can create a Board', async () => {
        const board = await Board.create({
            type: "Soft Cheese", 
            description: "Lorem Ipsum Hard Cheese",
            rating: 4
        })
        expect(board).toBeDefined();
        expect(board.type).toBe("Soft Cheese"),
        expect(board.description).toBe("Lorem Ipsum Hard Cheese"),
        expect(board.rating).toBe(4)
    })

    test ('if it can create a Cheese', async () => {
        const cheese = await Cheese.create({
            title: "Manchego", 
            description: "Lorem Ipsum Manchego",
        })
        expect(cheese).toBeDefined();
        expect(cheese.title).toBe("Manchego"),
        expect(cheese.description).toBe("Lorem Ipsum Manchego")
    })

    //test READ from CRUD
    test ('if it can find a User', async () => {
        await db.sync({force: true});
        const user1 = await  User.create({name: "Yegor", email: "yegor.email.com"});
        const user2 = await  User.create({name: "Valeria", email: "valeria.email.com"});
        const users = await User.findAll(
        );
        expect(users).toBeDefined();
        expect(users.length).toBe(2);
        expect(users[0].name).toBe('Yegor');
        expect(users[1].id).toBe(2)
    })
})

describe('Test associations for User, Board and Cheese', () => {

    test('if board can have many Cheeses and a Cheese can be on many Boards', async () => {
        await db.sync({ force:true });
        let board1 = await Board.create(seedBoard[0]);
        let board2 = await Board.create(seedBoard[1]);
        let cheese1 = await Cheese.create(seedCheese[0]);
        let cheese2 = await Cheese.create(seedCheese[1]);

        await board1.addCheese(cheese1);
        await board1.addCheese(cheese2);
        const board1Cheeses = await board1.getCheeses();
        expect(board1Cheeses.length).toBe(2);

        await board2.addCheese(cheese1);
        const cheese1Boards = await cheese1.getBoards();
        expect(cheese1Boards.length).toBe(2);
        const cheese2Boards = await cheese2.getBoards();
        expect(cheese2Boards.length).toBe(1);
    })

    test('if multiple boards can be added to a User', async () => {
        await db.sync({ force:true });
        let user1 = await User.create(seedUser[0]);
        let board1 = await Board.create(seedBoard[0]);
        let board2 = await Board.create(seedBoard[1]);

        await user1.addBoard(board1);
        await user1.addBoard(board2);
        const user1Boards = await user1.getBoards();
        expect(user1Boards.length).toBe(2);
    })

    test('if a Board can be loaded with its cheeses', async () => {
        await db.sync({ force:true });

        await User.bulkCreate(seedUser);
        await Board.bulkCreate(seedBoard);
        await Cheese.bulkCreate(seedCheese);

        let board1 = await Board.findByPk(1);
        let cheese1 = await Cheese.findByPk(1);
        let cheese2 = await Cheese.findByPk(2);
        await board1.addCheeses([cheese1,cheese2]);

        const wholeBoardWithCheeses = await Board.findAll({
            include: [{
                 model: Cheese
            }]
        });

        expect(wholeBoardWithCheeses[0].cheeses.length).toBe(2);
        expect(wholeBoardWithCheeses[1].cheeses.length).toBe(0);
    })
})