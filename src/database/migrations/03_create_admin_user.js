exports.up = async function(knex) {
  return knex.schema
    .createTable('admin_user', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('login').unique().notNullable();
      table.string('password').notNullable();
    });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('admin_user');
};