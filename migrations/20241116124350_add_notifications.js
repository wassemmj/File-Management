/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('addNotifications',async (table) => {
      table.increments('id').primary() ;
      table.string('message') ;
      table.integer('userId').unsigned().notNullable() ;
      table.integer('groupId').unsigned().notNullable() ;
      table.integer('adminId').unsigned().notNullable() ;
      table.foreign('userId').references('id').inTable('users');
      table.foreign('adminId').references('id').inTable('users');
  }) ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('addNotifications') ;
};
