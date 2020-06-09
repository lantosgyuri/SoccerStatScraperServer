const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const { statColumnNames } = require('../../dbService/constants/statColumnNames');

const configMiddlewares = app => {
    app.use(morgan('tiny'));
    app.use(compression());
    app.use(helmet());
    app.use(express.json());
};

const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        status: statusCode,
        message: process.env.NODE_ENV === 'production' ? '🥞' : error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
};

const configErrorHandler = app => {
    app.use(notFound);
    app.use(errorHandler)
};

const filteredGamesValidator = (req, res, next) => {

    const isBodyValid = body => {
        const keys = Object.keys(body);

        const validKeysCount = keys.length < 3;
        const allKeysValid = keys.every(item => item === 'home' || item === 'away');

        if(!validKeysCount || !allKeysValid) {
            return false;
        }

        const paramNames = keys
            .reduce((acc, item) => [...acc, ...Object.keys(body[item])],[]);

        const isThereInvalidKey = paramNames.reduce((acc, key) => {
            if (acc) return true;
            return !Object.keys(statColumnNames).some(columnName => columnName === key);
        }, false);

       return !isThereInvalidKey;

    };

    if(!isBodyValid(req.body)) {
        const error = new Error('Body is not valid');
        res.status(400);
        next(error);
    }
    next();
};

module.exports = {
    configMiddlewares,
    configErrorHandler,
    filteredGamesValidator,
};
