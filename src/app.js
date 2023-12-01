const config = require('./config/config.json');
const dbPool = require('./config/db/DbPool');
const { configureSocketConnection } = require('./config/socket/socket');
const { app, server } = require('./config/server/server');


const io = configureSocketConnection(server);

