/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('userGroups' , (table) => {
        table.increments('id').primary() ;
        table.integer('user_id').unsigned().notNullable();
        table.integer('group_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.foreign('group_id').references('id').inTable('groups');
    }) ;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('userGroups') ;
};
