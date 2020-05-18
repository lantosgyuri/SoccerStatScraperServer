const express = require('express');

const {
    configMiddlewares,
    configErrorHandler,
} = require('./config/middlewares');

const Routes = require('./modules');

const app = express();
configMiddlewares(app);

app.get('/', (req, res) => {
    res.send('Use an existing route')
});

app.use('/api/v1/games', Routes.games);

configErrorHandler(app);



module.exports = app;

/*
SELECT g.league,g.date, g.hash,
t1.name AS home_team, t2.name AS away_team,
l.name AS league, hst.goals_1 AS home_goals,
ast.goals_1 AS away_goals
FROM game g
JOIN team t1 ON g.home_team = t1.id
JOIN team t2 ON g.away_team = t2.id
JOIN league l ON g.league = l.id
JOIN home_stat hst ON g.home_team = hst.team_id
JOIN away_stat ast ON g.away_team = ast.team_id
WHERE l.name = 'Bundesliga'
AND hst.goals_1 = 3 AND ast.goals_1 = 1
 */
