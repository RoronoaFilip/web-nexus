const socketIO = require("socket.io");
const chatService = require('../../core/service/chat-service');

// Store user information and socket IDs
const users = {};
const chatsId = [];

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
      const { to, message, from } = data;

      const toSocket = users[to];

      chatService.saveMessageInRedis(from, to, message)
        .then((result) => {
          console.log(result);

          if (toSocket) {
            toSocket.emit('receive private message', { from, message });
          } else {
            socket.emit('private message error', `User ${to} not found`);
          }
        })
        .catch(error => socket.emit('private message error', `An Error occurred while saving in redis: ${error}`));
    });

    // Store user information on connection
    socket.on('store user', (email) => {
      users[email] = socket;
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

    socket.on('save chat', ({ from, to }) => {
      chatService.saveChatInDb(from, to);
    });

    socket.on('set chat', (body) => {
      
      const { from, to } = body;
      chatService.setChatDetails(from, to, 0)
          .then((response) => console.log(respose))
          .catch((error) => console.log(error));
    })
  });

  return io;
}

module.exports = { configureSocketConnection };