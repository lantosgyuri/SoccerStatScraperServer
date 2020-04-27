const tableNames = require('../constants/tableNames');

const addTimeColumns = table => {
  table.timestamps(false, true);
  table.datetime('deleted_at');
};

const createNameTable = (knex, tableName) => knex.schema.createTable(tableName, table => {
    table.increments().notNullable();
    table.string('name').notNullable().unique();
    addTimeColumns(table);
});

const addHashColumn = table => {
    table.string('hash').notNullable().unique();
};

const createStatTable = (knex, tableName) => knex.schema.createTable(tableName, table =>  {
    table.increments().notNullable();
    table.boolean('stat_available');
    createReference(table, tableNames.team);
    table.decimal('goals_scored_per_match');
    table.decimal('clean_sheets');
    table.decimal('won_to_nil');
    table.decimal('scoring_rate');
    table.decimal('scored_in_both_halves');
    table.decimal('team_scored_first');
    table.decimal('leading_at_half_time');
    table.decimal('goals_scored_per_match');
    table.decimal('goals_conceded_per_match');
    table.decimal('failed_to_score');
    table.decimal('lost_to_nil');
    table.decimal('conceding_rate');
    table.decimal('conceded_in_both_halves');
    table.decimal('opponent_scored_first');
    table.decimal('loosing_at_half_time');
    table.decimal('scored_conc_per_match');
    table.decimal('matches_over_1_5_goals');
    table.decimal('matches_over_2_5_goals');
    table.decimal('matches_over_3_5_goals');
    table.decimal('matches_over_4_5_goals');
    table.decimal('matches_over_5_5_goals');
    table.decimal('both_team_scored');
    table.decimal('over_0_5_g_at_half_time');
    table.decimal('over_1_5_g_at_half_time');
    table.decimal('over_2_5_g_at_half_time');
    addTimeColumns(table);
});

const createReference = (table, tableName, columnName = '') => table
    .integer(`${columnName || tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName)
    .onDelete('cascade')
    .notNullable();

module.exports = {
    addTimeColumns,
    addHashColumn,
    createNameTable,
    createReference,
    createStatTable,
};
