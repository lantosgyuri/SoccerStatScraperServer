const Knex = require('knex');
const tableNames = require('../constants/tableNames');
const {
    createInsertReadyWeeklyHash
} = require('../utils/dataExtractor');

const gamesWithLeagues = require('../../scrapeService/scrapeResponseSamples/organizeGameListsWithLeagues');
const stats = require('../../scrapeService/scrapeResponseSamples/teamStats');

/**
 * @param {Knex} knex
 */
exports.seed = async knex => {
    await Promise.all(
        Object.keys(tableNames)
            .map(tableName => knex(tableName).del())
    );

    const leagues = gamesWithLeagues.map(item => ({ name: item.leagueName }));

    const createdLeague = await knex(tableNames.league)
        .insert(leagues)
        .returning('*');

    console.log('Created Leagues', createdLeague);

    const teams = gamesWithLeagues.reduce((acc, item) => {
        const { games } = item;
        if(games.length > 0 ) {
            const teams = games.map(item => [
                { name: item.homeTeam },
                { name: item.awayTeam },
            ]);
            return acc.concat(...teams)
        } else {
            return [...acc];
        }
    }, []);

    const createdTeams = await knex(tableNames.team)
        .insert(teams)
        .returning('*');

    console.log(' Created teams: ', createdTeams);


    const weeklyGameHash = gamesWithLeagues.filter(item => item.hash !== 'no hash');

    const hashesWithIds = await Promise.all(weeklyGameHash
            .map(async item => {
                const id = await knex(tableNames.league).where('name',
                    item.leagueName).select('id').first();
                return {
                league_id: id.id,
                hash: item.hash
            }}));

    console.log(hashesWithIds);

    const createdHash = await knex(tableNames.weekly_game_hash)
        .insert(hashesWithIds)
        .returning('*');

    console.log('Created Hash', createdHash);

};
