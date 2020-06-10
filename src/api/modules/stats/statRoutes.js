const { Router } = require('express');
const { getStatForTeam } = require('./statsController');
const { statForTeamValidator } = require('../../config/middlewares');

const routes = Router();

routes.get('/team/:teamID/:state', statForTeamValidator, getStatForTeam);

module.exports = routes;
