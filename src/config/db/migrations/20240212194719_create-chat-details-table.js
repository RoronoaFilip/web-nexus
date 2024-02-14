/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('chat_details', function(table){
    table.increments('id').primary();
    table.string('from', 70).unique();
    table.string('to', 70).unique();
    table.integer('chat_id').unique();
    table.json("chat");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('chat_details');
};
