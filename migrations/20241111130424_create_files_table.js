/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('files' , (table) => {
      table.increments('id').primary() ;
      table.string('fileName').notNullable() ;
      table.boolean('status').notNullable().defaultTo('false') ;
      table.integer('userCheckIn') ;
      table.integer('groupID').unsigned().notNullable() ;
      table.foreign('groupID').references('groups.id') ;
      table.timestamps(true, true) ;
  }) ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('files') ;
};
