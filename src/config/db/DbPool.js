const { Pool } = require('pg');
const config = require('../config.json');
const dbPool = new Pool({
    host: 'localhost',
    port: config.dbPostgresPort,
    user: config.dbUsername,
    password: config.dbPassword,
    database: config.database
})

module.exports = dbPool