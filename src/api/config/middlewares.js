const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

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

const errorHandler = (error, req, res) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        status: statusCode,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
};

const configErrorHandler = app => {
    app.use(notFound);
    app.use(errorHandler)
};

module.exports = {
    configMiddlewares,
    configErrorHandler,
};
