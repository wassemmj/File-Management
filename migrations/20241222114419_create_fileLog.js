/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('fileLogs' , async (table) => {
        table.increments('id').primary() ;
        table.string('logs') ;
        table.date('date');
        table.integer('fileId').unsigned().notNullable() ;
        table.foreign('fileId').references('id').inTable('files');
        table.integer('userId').unsigned().notNullable() ;
        table.foreign('userId').references('id').inTable('users');
    }) ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('fileLogs');
};
