exports.up = async function(knex) {
  return knex.schema.createTable('pays_methods', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('image').notNullable();
    table.string('type').notNullable();
    table.string('name_user').notNullable();
    table.string('agency').notNullable();
    table.string('account').notNullable();
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('pays_methods');
}