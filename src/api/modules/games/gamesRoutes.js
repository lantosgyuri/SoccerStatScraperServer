const { Router } = require('express');
const { getFilteredGames } = require('./gamesController');
const { filteredGamesValidator } = require('../../config/middlewares');

const routes = Router();

routes.post('/filter', filteredGamesValidator, getFilteredGames);

module.exports = routes;
