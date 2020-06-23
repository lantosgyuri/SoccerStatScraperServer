require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: './src/dbService/migrations',
    },
    seeds: {
      directory: './src/dbService/seeds',
    },
  },
    test: {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        database: process.env.POSTGRES_DB_TEST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      },
      migrations: {
        directory: './src/dbService/migrations',
      },
      seeds: {
        directory: './src/dbService/seeds',
      },
  },
};
