import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().index();
  });

  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary();
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .index();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id');
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.boolean('is_on_diet').notNullable();
    table.uuid('session_id').references('id').inTable('sessions');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('sessions');
  await knex.schema.dropTable('meals');
}
