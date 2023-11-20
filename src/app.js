const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const {createFileReadStream} = require('./utils/file_read_stream');
const {createTransformStream} = require('./utils/file_transform');
const {responseHandlers} = require('./utils/response_handlers');
const http = require('http');
const config = require('./config');


const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server, {
  cors: {
    origin: '*',
  },
});

app.listen(config.httpPort, () => {
  console.log(`Server is listening on :${config.httpPort}`);
});
server.listen(config.socketPort, () => {
  console.log(`Socket Server is running on :${config.socketPort}`);
});

app.use(cors());
app.use(express.json());
app.use(express.raw());

/**
 * Fetch the SDK
 */
app.get('/sdk', function (req, res) {
  const filePath = '../dist/bundle.js';

  const readStream = createFileReadStream(filePath)
      .on('error', () => {
            responseHandlers.internalServer(req, res, true);
          }
      );

  res.setHeader('Content-Type', 'application/javascript');

  readStream.pipe(res);
});

// Store user information and socket IDs
const users = {};

/**
 * Fetch the Login Form
 */
app.get('/login-form', (req, res) => {
  res.sendFile(__dirname + '/pages/login-form.html');
});

/**
 * Fetch the Chat Box. Replaces all instances of {{name}} with the name.
 * Notice the IDs of all HTML elements. These are used by the SDK to Determine in whose chat box to append the message.
 */
app.post('/chat', (req, res) => {
  const replacementMap = {
    name: req.body.name,
  };

  const readStream = createFileReadStream(__dirname + '/pages/chat_box.html');
  const transformStream = createTransformStream(replacementMap);

  readStream.on('error', (err) => {
    responseHandlers.internalServer(req, res);
    res.send(err);
  });

  transformStream.on('error', (err) => {
    responseHandlers.internalServer(req, res);
    res.send(err);
  });

  readStream.pipe(transformStream).pipe(res);
});

io.on('connection', (socket) => {
  console.log(`A user connected. Socket ID: ${socket.id}`);

  /**
   * Handle private messages on send. Emits receive to the recipient or private message error to the sender.
   */
  socket.on('send private message', (data) => {
    const {to, message, from} = data;
    const toSocket = users[to];
    if (toSocket) {
      toSocket.emit('receive private message', {from, message});
    } else {
      // Handle user not found
      socket.emit('private message error', `User ${to} not found`);
    }
  });

  // Store user information on connection
  socket.on('store user', (username) => {
    users[username] = socket;
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove user information on disconnect
    for (const [ key, value ] of Object.entries(users)) {
      if (value === socket) {
        console.log(`User with Username: ${key} has disconnected`);
        delete users[key];
      }
    }
  });
});
