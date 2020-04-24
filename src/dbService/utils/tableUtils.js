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

const addStatColumns = table =>  {
   table.boolean('stat_available');
   // TODO FINISH THIS
};

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
};
