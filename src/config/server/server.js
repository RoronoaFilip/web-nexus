const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const apiRouter = require("../../api/api_router");
const config = require("../config.json");
const checkAuthentication = require('../../api/middlewares/checkAuthentication');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api', apiRouter);

app.use(checkAuthentication);

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


module.exports = { app, server };
