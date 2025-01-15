/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable("refresh_tokens", (table) => {
        table.increments("id").primary();
        table.integer("user_id").notNullable(); // Reference to user in your users table
        table.string("refresh_token").notNullable(); // Hashed refresh token
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable("refresh_tokens");
};
