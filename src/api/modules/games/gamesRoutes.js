const { Router } = require('express');
const { getFilteredGames } = require('./gamesController');

const routes = Router();

// todo change get to post
routes.get('/filter', getFilteredGames);

module.exports = routes;
