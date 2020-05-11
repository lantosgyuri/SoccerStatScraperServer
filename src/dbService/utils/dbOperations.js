const db = require('../db');
const tableNames = require('../constants/tableNames');

// Inserts
const createUpsertOrDoNothing = dataBase => tableName => conflictingFields => async dataToBeInserted =>
            dataBase.raw(
                `? ON CONFLICT (${conflictingFields})
            DO NOTHING
            RETURNING *;`,
                [dataBase(tableName).insert(dataToBeInserted)],
            );

const createInsert = dataBase => tableName => async items => dataBase(tableName).insert(items).returning('*');

const upsertOrDoNothing = createUpsertOrDoNothing(db);
const insert = createInsert(db);

const createInsertIntoLeagues = upsertOrDoNothing(tableNames.league);
const createInsertIntoTeams = upsertOrDoNothing(tableNames.team);

const insertIntoWeeklyGameHash = insert(tableNames.weekly_game_hash);
const insertIntoGames = insert(tableNames.game);
const insertIntoAwayStat = insert(tableNames.weekly_away_stat);
const insertIntoHomeStat = insert(tableNames.weekly_home_stat);

const insertIntoLeagues = createInsertIntoLeagues('name');
const insertIntoTeams = createInsertIntoTeams('name');

// Queries
const createQuery = dataBase => tableName => async (...fields) =>
            dataBase(tableName).select(...fields);

const createIdQueryForName = dataBase => tableName => async name =>
            dataBase(tableName).where('name', name).select('id').first();

const query = createQuery(db);
const idQuery = createIdQueryForName(db);

const createWeeklyGameHashQuery = query(tableNames.weekly_game_hash);

const getLeagueIdWhereNameFromDB = idQuery(tableNames.league);
const getTeamIdWhereNameFromDB = idQuery(tableNames.team);

const getWeeklyGameHashFromDB = createWeeklyGameHashQuery('hash');

module.exports = {
    insertIntoLeagues,
    insertIntoTeams,
    insertIntoWeeklyGameHash,
    insertIntoGames,
    insertIntoAwayStat,
    insertIntoHomeStat,
    getWeeklyGameHashFromDB,
    getLeagueIdWhereNameFromDB,
    getTeamIdWhereNameFromDB,
};
