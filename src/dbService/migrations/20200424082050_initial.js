const Knex = require('knex');

const tableNames = require('../constants/tableNames');
const {
    addTimeColumns,
    addHashColumn,
    createNameTable,
    createReference
} = require('../utils/tableUtils');

/**
 * @param {Knex} knex
 */
// table.bigInteger('AddressId').unsigned().index().references('id').inTable('Address')
exports.up = async (knex) => {
    await createNameTable(knex, tableNames.league);
    await createNameTable(knex, tableNames.game);
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

};

exports.down = async (knex) => {

};
