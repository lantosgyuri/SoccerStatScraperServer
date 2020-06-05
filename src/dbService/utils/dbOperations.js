const db = require('../db');
const tableNames = require('../constants/tableNames');
const moment = require('moment');
const { statNameHome, statNameAway } = require('../constants/statColumnNames');

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
const createBaseQuery = dataBase => tableName => (...fields) => async () =>
            dataBase.from(tableName).select(fields);

const createIdQueryForName = dataBase => tableName => async name =>
            dataBase.from(tableName).where('name', name).select('id').first();

const query = createBaseQuery(db);
const idQuery = createIdQueryForName(db);

const createWeeklyGameHashQuery = query(tableNames.weekly_game_hash);
const createGameHashQuery = query(tableNames.game);

const getLeagueIdWhereNameFromDB = idQuery(tableNames.league);
const getTeamIdWhereNameFromDB = idQuery(tableNames.team);

const getWeeklyGameHashFromDB = createWeeklyGameHashQuery('hash');
const getGameHashFromDB = createGameHashQuery('hash');

const getLatestStat = (statTable) => db(statTable).max('id').groupBy('team_id');
const yesterday = moment().subtract(1, 'day').toISOString();

const baseQuery =  db(`${tableNames.game} AS g`)
    .join(`${tableNames.league} as l`, 'g.league_id', 'l.id' )
    .join(`${tableNames.team} as t1`, 'g.home_team_id', 't1.id')
    .join(`${tableNames.team} as t2`, 'g.away_team_id', 't2.id')
    .join(
        db(tableNames.weekly_home_stat).whereIn('id', getLatestStat(tableNames.weekly_home_stat))
            .as('hst'), 'g.home_team_id', 'hst.team_id')
    .join(
        db(tableNames.weekly_away_stat).whereIn('id', getLatestStat(tableNames.weekly_away_stat))
            .as('ast'), 'g.away_team_id', 'ast.team_id')
    .select(
        'l.name AS league',
        't1.name AS home_team',
        'g.home_team_id AS home_team_id',
        'g.away_team_id AS away_team_id',
        't2.name AS away_team',
        'g.game_date AS date')
    .where('g.game_date', '>', yesterday);

const addParamToFilteredGamesQuery = params => {
    const param = params[0];
    const value = params[1];
   return (baseQuery) => baseQuery.where(param, '>', value);
};

const addParamToFilteredGamesQuery2 = params => {
    return (baseQuery) => baseQuery.where('l.name', 'Turkey - Super Lig');
};

const getFilteredGamesFromDB = (params) => {

};

const createBaseStatQuery = dataBase => tableName => async id =>
    dataBase.from(tableName)
        .where('team_id', id)
        .select('*')
        .orderBy('id', 'desc')
        .limit(1);

const createStatQuery = createBaseStatQuery(db);

const getHomeTeamStatFromDB = createStatQuery(tableNames.weekly_home_stat);
const getAwayTeamStatFromDB = createStatQuery(tableNames.weekly_away_stat);

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
    getHomeTeamStatFromDB,
    getAwayTeamStatFromDB,
};
