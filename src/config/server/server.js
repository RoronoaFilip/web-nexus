const express = require("express");
const http = require("http");
const cors = require("cors");
const apiRouter = require("../../api/api_router");
const config = require("../config.json");

const app = express();
const server = http.createServer(app);

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


module.exports = { app, server };
