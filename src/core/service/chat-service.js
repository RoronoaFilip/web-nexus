const redisService = require('../service/redis-service');
const redisClient = require('../../config/in-memory/redis-client');
const {v4: uuidv4} = require('uuid');

// Data Base imports
const knex = require('knex');
const knexConfig = require('../../config/db/knexfile')[process.env.NODE_ENV || 'development'];
const db = knex(knexConfig);


function setChatDetails(from, to, id) {
  return getChatDetails(from, to)
      .then((result) => {
        if (result) {
          return Promise.resolve('Chat already set!');
        }

        const key = getExactKey(from, to);
        const chatId = uuidv4();
        redisClient.set(key, chatId)
            .then(() => Promise.resolve('Successfully Set!'))
            .catch((error) => Promise.reject(`Redis return the following error: ${error}`));
      });
}

function getChatDetails(from, to) {
  return new Promise((resolve, reject) => {
    const key = getExactKey(from, to);
    redisClient.get(key)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
  });
}

function saveMessageInRedis(from, to, message) {
  return getChatDetails(from, to)
      .then((chatId) => {
        console.log(`Chat id: ${chatId}`);
        return redisService.addMessage(chatId, from, message);
      });
}

function getExactKey(from, to) {
  const usersArray = [from, to];
  usersArray.sort();
  return `${usersArray[0]}-${usersArray[1]}`;
}

function getMessagesToJsonArray(id) {
  return new Promise((resolve, reject) => {
    redisClient.lRange(id, 0, -1)
        .then((result) => result.map(JSON.parse))
        .then((messages) => resolve({messages}))
        .catch((error) => reject(error));
  });
}

function clearChatInRedis(from, to, id) {
  const key = getExactKey(from, to); // TODO: Deleting Deleted chat causes error
  // Delete the chat details
  redisClient.del(key);
  // Delete the chat itself
  redisClient.del(id);
}

function saveChatInDb(from, to) {
  return getChatDetails(from, to)
      .then((chatId) =>
          getMessagesToJsonArray(chatId)
              .then((messages) => Promise.resolve({chatId, messages}))
              .catch((error) => Promise.reject(error))
      )
      .then(async ({chatId, messages}) => {

        // TODO loading the chat from the database
        // TODO fix saving of chat( think about from, to columns)
        const usersArray = [from, to];
        usersArray.sort();
        debugger;
        const chat = await db('chat_details')
            .select('*')
            .where({
              from: usersArray[0],
              to: usersArray[1]
            }).first();

        if (chat) {
          messages.messages = mergeChats(chat.chat, messages);
          const newChat = await db('chat_details')
              .where({
                from: usersArray[0],
                to: usersArray[1]
              })
              .update({
                chat: messages
              })
        } else {
          const result = await db.insert([{from: usersArray[0], to: usersArray[1], chat_id: chatId, chat: messages}])
              .into('chat_details');
          if (result) {
            // clearChatInRedis(from, to, chatId);
            return Promise.resolve('Chat was successfully saved  in db!');
          }
          return Promise.reject('Saving in DB caused an error!');
        }
      });
}

function mergeChats(oldChat, newChat) {
  return oldChat.messages.concat(newChat.messages);
}

module.exports = {saveMessageInRedis, setChatDetails, saveChatInDb};