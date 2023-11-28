/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    return knex('users').del()
        .then(function () {
            return knex('users').insert([
                {
                    id: 1,
                    email: 'aleksandar.i.petrov@webnexus.com',
                    first_name: 'Aleksandar',
                    last_name: 'Petrov',
                    password: 'thisisalexpass'
                },
                {
                    id: 2,
                    email: 'filip.filchev@webnexus.com',
                    first_name: 'Filip',
                    last_name: 'Filchev',
                    password: 'thisisfilippass'
                },
            ]);
        });
};
