exports.up = async function(knex) {
  return knex.schema
    .createTable('orders', table => {
      table.increments('id').primary();
      table.integer('number');
      table.integer('value');
      table.string('numbers_id');
      table.string('status');
      table.string('name_user');
      table.string('telefone01');
      table.string('telefone02');
      table.string('cpf', 11);
      table.string('affiliate_name');

      table.integer('affiliate_id')
          .references('id')
          .inTable('affiliates');

      table.integer('raffle_id')
          .notNullable()
          .references('id')
          .inTable('raffle');
    })
};

exports.down = async function(knex) {
  return knex.schema
    .dropTable('orders')
};