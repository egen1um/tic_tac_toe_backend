const app = require('../tic-tac-toe-app');
const request = require('supertest');

describe("Test game states", () => {
    it("Test if game state is -1 before game is started", async () => {
        const res = await request(app).post('/getCurrentSession');
        expect(res.status).toBe(200);
        expect(res.body.gameState).toBe(-1);
    });

    it("Test if game doesn't allow to mark cells before game is started", async () => {
        const res = await request(app).post('/markCell').send({cellId: 0})
        expect(res.status).toBe(400);
        expect(res.text).toContain("error");
    });

    it("Test if game state is 0 after game is started", async () => {
        const res = await request(app).post('/startSession')
        expect(res.status).toBe(200);
        expect(res.body.gameState).toBe(0);
    });

    it("Test if game allows to mark cells before game is started", async () => {
        const res = await request(app).post('/markCell').send({cellId: 0})
        expect(res.status).toBe(200);
        expect(res.body.gridState[0]).toBe(res.body.players[0]);
    });

    it("Test if game state is 1 when game is won", async () => {
        await request(app).post('/markCell').send({cellId: 3})
        await request(app).post('/markCell').send({cellId: 1})
        await request(app).post('/markCell').send({cellId: 4})
        await request(app).post('/markCell').send({cellId: 2})

        const res = await request(app).post('/getCurrentSession');
        expect(res.status).toBe(200);
        expect(res.body.gameState).toBe(1);
    });

    it("Test if game state is 0 and grid is cleared after game is restarted", async () => {
        const res = await request(app).post('/startSession')
        expect(res.status).toBe(200);
        expect(res.body.gameState).toBe(0);
        expect(Object.values(res.body.gridState)).toStrictEqual([-1, -1, -1, -1, -1, -1, -1, -1, -1]);
    });

    it("Test if game state is 2 when game is a draw", async () => {
        await request(app).post('/markCell').send({cellId: 0})
        await request(app).post('/markCell').send({cellId: 3})
        await request(app).post('/markCell').send({cellId: 1})
        await request(app).post('/markCell').send({cellId: 4})
        await request(app).post('/markCell').send({cellId: 5})
        await request(app).post('/markCell').send({cellId: 2})
        await request(app).post('/markCell').send({cellId: 6})
        await request(app).post('/markCell').send({cellId: 7})
        await request(app).post('/markCell').send({cellId: 8})

        const res = await request(app).post('/getCurrentSession');
        expect(res.status).toBe(200);
        expect(res.body.gameState).toBe(2);
    });
})
