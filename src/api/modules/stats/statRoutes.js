const { Router } = require('express');
const { getStatForTeam, getAvailableStatFields } = require('./statsController');
const { statForTeamValidator } = require('../../config/middlewares');

const routes = Router();

routes.get('/team/:teamID/:state', statForTeamValidator, getStatForTeam);
routes.get('/available-fields', getAvailableStatFields);

module.exports = routes;
