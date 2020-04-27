const Knex = require('knex');

const tableNames = require('../constants/tableNames');
const {
    addTimeColumns,
    addHashColumn,
    createNameTable,
    createReference,
    createStatTable,
} = require('../utils/tableUtils');

/**
 * @param {Knex} knex
 */
// table.bigInteger('AddressId').unsigned().index().references('id').inTable('Address')
exports.up = async (knex) => {
    await createNameTable(knex, tableNames.league);
    await createNameTable(knex, tableNames.team);
    await knex.schema.createTable(tableNames.weekly_game_hash, table => {
        table.increments().notNullable();
        createReference(table, tableNames.league);
        addHashColumn(table);
        addTimeColumns(table);
    });
    await knex.schema.createTable(tableNames.game, table => {
        table.increments().notNullable();
        createReference(table, tableNames.league);
        createReference(table, tableNames.team, 'home_team');
        createReference(table, tableNames.team, 'away_team');
        table.datetime('game_date');
        addHashColumn(table);
    });
    await createStatTable(knex, tableNames.weekly_home_stat);
    await createStatTable(knex, tableNames.weekly_away_stat);
};

exports.down = async (knex) => {
    await Promise.all([
       tableNames.weekly_home_stat,
       tableNames.weekly_away_stat,
        tableNames.weekly_game_hash,
        tableNames.game,
        tableNames.team,
        tableNames.league
    ].map(tableName => knex.schema.dropTableIfExists(tableName)));
};
