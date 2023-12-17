const knex = require('knex');
const knexConfig = require('../../config/db/knexfile')[process.env.NODE_ENV || 'development'];
const db = knex(knexConfig);

async function getUser(email, password) {
  try {
    const user = await db('users')
      .select('*')
      .where({
        email: email,
        password: password
      }).first();

    return user;
  } catch (error) {
    throw error;
  }
}

async function register(firstName, lastName, email, password) {
  try {
    const result = await db
      .insert([{ email: email, password: password, first_name: firstName, last_name: lastName }])
      .into('users');
  } catch (error) {
    throw error;
  }
}

module.exports = { getUser, register };