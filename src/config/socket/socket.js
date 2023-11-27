const socketIO = require("socket.io");

// Store user information and socket IDs
const users = {};

/**
 * Store user information and socket IDs
 * @param server
 */
function configureSocketConnection(server) {

  const io = new socketIO.Server(server, {
    cors: {
      origin: '*',
    }
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

  return io;
}

module.exports = {configureSocketConnection};