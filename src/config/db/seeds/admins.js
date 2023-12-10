/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    return knex('users').del()
        .then(function () {
            return knex('users').insert([
                {
                    email: 'aleksandar.i.petrov@webnexus.com',
                    first_name: 'Aleksandar',
                    last_name: 'Petrov',
                    password: '1234'
                },
                {
                    email: 'filip.filchev@webnexus.com',
                    first_name: 'Filip',
                    last_name: 'Filchev',
                    password: '1234'
                },
            ]);
        });
};
