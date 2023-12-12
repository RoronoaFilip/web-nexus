const { configureSocketConnection } = require('./config/socket/socket');
const { server } = require('./config/server/server');

const io = configureSocketConnection(server);

