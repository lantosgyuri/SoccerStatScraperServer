const Knex = require('knex');
const tableNames = require('../constants/tableNames');
const {
    createInsertReadyWeeklyHash
} = require('../utils/dataExtractor');

/**
 * @param {Knex} knex
 */
exports.seed = async knex => {
    await Promise.all(
        Object.keys(tableNames)
            .map(tableName => knex(tableName).del())
    );

    const league = [
        { name: 'Bundesliga' },
        { name: 'Bundesliga1' },
    ];

    const createdLeague = await knex(tableNames.league)
        .insert(league)
        .returning('*');

    console.log('Created Leagues', createdLeague);

    const teams = [
        { name: 'Bayern' },
        { name: 'StPauli' },
        { name: 'Hertha' },
        { name: 'Augsburg' },
    ];

    const createdTeams = await knex(tableNames.team)
        .insert(teams)
        .returning('*');

    console.log(' Created teams: ', createdTeams);

    const weeklyGameHash = [
        { name: 'Bundesliga', hash: '2a191d9b1c89784d03048b0c1b585810' },
        { name: 'Bundesliga1', hash: '84306a607bf307a0fbb689d3f2d92a9e' },
    ];

    const leagueIds = await knex(tableNames.league).whereIn('name',
        weeklyGameHash.map(item => item.name)).select('id');

    console.log(leagueIds);

    const createdHash = await knex(tableNames.weekly_game_hash)
        .insert(createInsertReadyWeeklyHash(weeklyGameHash, leagueIds))
        .returning('*');

    console.log('Created Hash', createdHash);
};
