exports.up = async function(knex) {
  return knex.schema
    .createTable('affiliates', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('cpf').notNullable();
      table.string('phone').notNullable();
      table.integer('sales').notNullable();
      table.string('bank').notNullable();
      table.string('type').notNullable();
      table.string('agency').notNullable();
      table.string('account').notNullable();
    })
};

exports.down = async function(knex) {
  return knex.schema.dropTable('affiliates');
};