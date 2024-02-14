require('dotenv').config();

const redis = require('redis');
const redisPort = process.env.REDIS_PORT;
const redisClient = redis.createClient({ host: 'web-nexus-redis', port: redisPort });

redisClient.connect()
  .then(r => console.log('Connected'))
  .catch((error) => {
    console.log('Cannot connect to redis ', error);
  });

module.exports = redisClient;