const knex = require('knex');

const connection = knex({
  client: 'pg',
  host: 'localhost',
  connection: {
    database: "vale_premier",
    user: "postgres",
    password: "garcez12GS"
  },
  useNullAsDefault: true,
})

module.exports = connection;