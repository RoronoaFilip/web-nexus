const redisService = require('../service/redis-service');
const redisClient = require('../../config/in-memory/redis-client');
const {v4: uuidv4} = require('uuid');

// Data Base imports
const knex = require('knex');
const knexConfig = require('../../config/db/knexfile')[process.env.NODE_ENV || 'development'];
const db = knex(knexConfig);


function setChatDetails(from, to, id) {
  return new Promise(async (resolve, reject) => {
    const result = await getChatDetails(from, to);

    if (result) {
      resolve('Chat already set!');
      return;
    }

    const key = getExactKey(from, to);
    debugger;
    const chatId = uuidv4();
    redisClient.set(key, chatId)
        .then(() => resolve('Successfully Set!'))
        .catch((error) => reject('Redis return the following error: ', error));
  })
}

function getChatDetails(from, to) {
  return new Promise((resolve, reject) => {
    const key = getExactKey(from, to);
    redisClient.get(key)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
  });
}

async function saveMessageInRedis(from, to, message) {
  const chatId = await getChatDetails(from, to);
  // const chatDetails = JSON.parse(chatDetailsRaw);
  console.log('Chat id: ', chatId);
  return redisService.addMessage(chatId, from, message)
      .then((message) => {
        return message;
      })
      .catch((error) => alert(error));
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
  })
}

function clearChatInRedis(from, to, id) {
  const key = getExactKey(from, to);
  // Delete the chat details
  redisClient.del(key);
  // Delete the chat itself
  redisClient.del(id);
}

function saveChatInDb(from, to) {
  return new Promise(async (resolve, reject) => {
    const chatId = await getChatDetails(from, to);
    const messages = await getMessagesToJsonArray(chatId);
    const result = await db
        .insert([{from: from, to: to, chat_id: chatId, chat: messages}])
        .into('chat_details');

    if (result) {
      clearChatInRedis(from, to, chatId);
      resolve('Chat was successfully saved  in db!');
    } else {
      reject('Saving in DB caused an error!');
    }
  })
}

module.exports = {saveMessageInRedis, setChatDetails, saveChatInDb};