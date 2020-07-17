exports.up = async function(knex) {
  return knex.schema
    .createTable('numbers', table => {
      table.increments('id').primary();
      table.string('number');
      table.string('status');
      table.string('name_user');
      table.string('telefone01');
      table.string('telefone02');
      table.string('cpf', 11);

      table.integer('raffle_id')
          .notNullable()
          .references('id')
          .inTable('raffle');
    })
};

exports.down = async function(knex) {
  return knex.schema
    .dropTable('numbers')
};