const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile');
const environmentConfig = config[environment];
const db = require('knex');
const connection = db(environmentConfig);

module.exports = connection;
