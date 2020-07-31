require('dotenv/config');

const knex = require('knex');

const connection = knex({
  client: 'pg',
  host: 'localhost',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  },
  useNullAsDefault: true,
})

module.exports = connection;