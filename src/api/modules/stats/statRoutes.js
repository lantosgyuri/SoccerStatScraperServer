const { Router } = require('express');
const { getStatForTeam } = require('./statsController');

const routes = Router();

routes.get('/team/:teamID/:state', getStatForTeam);

module.exports = routes;
