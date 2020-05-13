const express = require('express');

const {
    configMiddlewares,
    configErrorHandler,
} = require('./config/middlewares');

const GamesRoutes = require('./modules');

const app = express();
configMiddlewares(app);

app.get('/', (req, res) => {
    res.send('Hey')
});

app.use('/api/v1/getGames', GamesRoutes);

configErrorHandler(app);



module.exports = app;
