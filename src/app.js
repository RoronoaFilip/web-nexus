const express = require('express');
const cors = require('cors');
const http = require('http');
const config = require('./config');
const {configureSocketConnection} = require('./socket/configure_socket_connection');
const apiRouter = require('./api/api_router');

const app = express();
const server = http.createServer(app);
const io = configureSocketConnection(server);

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);


/**
 * Heartbeat endpoint
 */
app.get('/', (req, res) => {
  res.send('WebNexus API is running');
});

app.listen(config.httpPort, () => {
  console.log(`Server is listening on :${config.httpPort}`);
});

server.listen(config.socketPort, () => {
  console.log(`Socket Server is running on :${config.socketPort}`);
});
