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
const createQuery = dataBase => tableName => (...fields) => async () =>
            dataBase.from(tableName).select(fields);

const createIdQueryForName = dataBase => tableName => async name =>
            dataBase.from(tableName).where('name', name).select('id').first();

const query = createQuery(db);
const idQuery = createIdQueryForName(db);

const createWeeklyGameHashQuery = query(tableNames.weekly_game_hash);
const createGameHashQuery = query(tableNames.game);

const getLeagueIdWhereNameFromDB = idQuery(tableNames.league);
const getTeamIdWhereNameFromDB = idQuery(tableNames.team);

const getWeeklyGameHashFromDB = createWeeklyGameHashQuery('hash');
const getGameHashFromDB = createGameHashQuery('hash');

// TODO stat and a game queries, always pick the latest one as, there will be the data always be inserted

const getFilteredGamesFromDB = async () => db(`${tableNames.game} AS g`)
    .join(`${tableNames.league} as l`, 'g.league_id', 'l.id' )
    .join(`${tableNames.team} as t1`, 'g.home_team_id', 't1.id')
    .join(`${tableNames.team} as t2`, 'g.away_team_id', 't2.id')
    .select('l.name', 't1.name', 't2.name')
    .where('l.name', 'Bundesliga');

module.exports = {
    insertIntoLeagues,
    insertIntoTeams,
    insertIntoWeeklyGameHash,
    insertIntoGames,
    insertIntoAwayStat,
    insertIntoHomeStat,
    getWeeklyGameHashFromDB,
    getGameHashFromDB,
    getLeagueIdWhereNameFromDB,
    getTeamIdWhereNameFromDB,
    getFilteredGamesFromDB,
};
