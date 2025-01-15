/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('backupsFiles' , async (table) => {
      table.increments('id').primary() ;
      table.string('fileName') ;
      table.string('userName') ;
      table.integer('fileId').unsigned().notNullable() ;
      table.foreign('fileId').references('id').inTable('files');
  }) ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('backupsFiles') ;
};
