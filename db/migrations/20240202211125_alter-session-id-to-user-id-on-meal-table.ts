import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumns('session_id');
    table.uuid('user_id').references('id').inTable('user');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.uuid('session_id').references('id').inTable('sessions');
    table.dropColumn('user_id');
  });
}
