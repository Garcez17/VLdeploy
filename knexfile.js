const path = require('path');

module.exports = {
  client: 'pg',
  host: 'localhost',
  connection: {
    database: 'vale_premier',
    user: 'postgres',
    password: 'garcez12GS'
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
  },
  useNullAsDefault: true,
}