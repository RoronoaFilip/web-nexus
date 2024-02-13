const redisClient = require('../../config/in-memory/redis-client');

function addMessage(chatId, from, message) {
  return new Promise((resolve, reject) => {
    const raw = {
      from: from,
      message: message
    };
    const messageObject = JSON.stringify(raw);

    console.log(chatId);

    redisClient.rPush(chatId, messageObject)
        .then(() => resolve('Successful stored message!'))
        .catch((error) => reject(error))
  })
}

function getMessages(chatId) {
  redisClient.lrange(chatId, 0, -1, (err, messages) => {
    if (err) {
      console.error(err);
    } else {
      const parsedMessages = messages.map(JSON.parse);
      console.log(parsedMessages);
    }
  });
}

function closeRedisConnection() {
  redisClient.quit();
}

module.exports = { addMessage, getMessages, closeRedisConnection };