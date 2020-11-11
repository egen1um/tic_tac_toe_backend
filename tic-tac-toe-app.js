'use strict';

const GameSession = require('./game-session')

const express = require('express');
const cors = require('cors');

const ticTacToeApp = express();

ticTacToeApp.use(cors())
ticTacToeApp.use(express.json());

ticTacToeApp.post('/startSession', (req, res) => {
	GameSession.startNewSession();
	GameSession.currentSession.gameState = GameSession.STATE_IN_PROGRESS;
	res.json(GameSession.currentSession);
});

ticTacToeApp.post('/markCell', (req, res) => {
	if (GameSession.currentSession.gameState !== GameSession.STATE_IN_PROGRESS) {
		let errorJson = {"error": "This game session is finished or wasn't properly started. Restart the game with '/startNewSession'"};
		res.status(400).send(JSON.stringify(errorJson));
		return;
	}

	let cellId = req.body.cellId;

	GameSession.currentSession.addLogEntry(cellId);
	GameSession.currentSession.markCell(cellId)
	
	GameSession.currentSession.gameState = GameSession.currentSession.getGameState()

	if (GameSession.currentSession.gameState === GameSession.STATE_IN_PROGRESS)
		GameSession.currentSession.setNextPlayerActive();
	
	res.json(GameSession.currentSession);
});

ticTacToeApp.post('/getCurrentSession', (req, res) => {
	res.json(GameSession.currentSession);
});

module.exports = ticTacToeApp