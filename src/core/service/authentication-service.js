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
        console.log(`Error ${error}`);
    }
}

module.exports = {getUser}