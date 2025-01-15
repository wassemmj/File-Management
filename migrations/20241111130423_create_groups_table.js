/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('groups' , (table) => {
        table.increments('id').primary() ;
        table.string('name').notNullable() ;
        table.integer('adminId').notNullable() ;
        table.timestamps(true, true);
    }) ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('groups') ;
};
