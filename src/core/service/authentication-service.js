const knex = require('knex');
const knexConfig = require('../../config/db/knexfile')[process.env.NODE_ENV || 'development'];
const db = knex(knexConfig);

async function getUser(email, password) {
  const user = await db('users')
    .select('*')
    .where({
      email: email,
      password: password
    }).first();

  return user;
}

async function register(firstName, lastName, email, password) {
  const result = await db
    .insert([ { email: email, password: password, first_name: firstName, last_name: lastName } ])
    .into('users');
}

module.exports = { getUser, register };