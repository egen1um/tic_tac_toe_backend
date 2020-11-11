class GameSession {
    static STATE_NOT_STARTED = -1;
    static STATE_IN_PROGRESS = 0;
    static STATE_ACTIVE_PLAYER_WON = 1;
    static STATE_DRAW = 2;

    static EMPTY_CELL_VALUE = -1;

    static currentSession = new GameSession();

    static startNewSession() {
        this.currentSession = new GameSession();
        return this.currentSession;
    }

    constructor() {
        this.players = ["X", "O"];
        this.activePlayerIndex = 0;
        this.log = [];
        this.gridState = {};
        for (let i = 0; i < 9; i++)
            this.gridState[i] = -1;

        this.gameState = GameSession.STATE_NOT_STARTED;
    }

    setNextPlayerActive() {
        if (this.activePlayerIndex >= this.players.length - 1)
            this.activePlayerIndex = 0;
        else
            this.activePlayerIndex++;
    }

    getActivePlayerId() {
        return this.players[this.activePlayerIndex];
    }

    addLogEntry(cellId) {
        this.log.push(new LogEntry(this.getActivePlayerId(), cellId));
    }

    getGameState() {
        let winCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const playerId of this.players)
            for (const winCombination of winCombinations)
                if (winCombination.every(cellId => this.gridState[cellId] === playerId))
                    return GameSession.STATE_ACTIVE_PLAYER_WON;

        if (Object.values(this.gridState).some(cellValue => cellValue === GameSession.EMPTY_CELL_VALUE))
            return GameSession.STATE_IN_PROGRESS;

        return GameSession.STATE_DRAW;
    }

    markCell(cellId) {
        this.gridState[cellId] = this.getActivePlayerId();
    }
}

class LogEntry {
    constructor(playerId, cellId) {
        this.datetime = new Date().toLocaleString();
        this.playerId = playerId;
        this.cellId = cellId;
    }
}

module.exports = GameSession