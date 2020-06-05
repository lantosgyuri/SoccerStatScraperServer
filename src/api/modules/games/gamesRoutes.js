const { Router } = require('express');
const { getFilteredGames } = require('./gamesController');

const routes = Router();

// todo change get to post
routes.post('/filter', getFilteredGames);

module.exports = routes;
