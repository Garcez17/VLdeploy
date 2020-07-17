exports.up = async function(knex) {
  return knex.schema
    .createTable('raffle', table => {
      table.increments('id').primary();
      table.string('image').notNullable();
      table.string('imageHome').notNullable();
      table.string('name').notNullable();
      table.string('initial_title').notNullable();
      table.string('type').notNullable();
      table.boolean('promotion').notNullable();
      table.string('description').notNullable();
      table.integer('value').notNullable();
      table.integer('fieldnumbers').notNullable();
      table.string('status').notNullable();
      table.string('winners');
    })
};

exports.down = async function(knex) {
  return knex.schema.dropTable('raffle');
};