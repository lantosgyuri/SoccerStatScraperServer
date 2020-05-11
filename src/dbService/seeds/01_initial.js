const Knex = require('knex');
const tableNames = require('../constants/tableNames');

const {
    getLeagueNames,
    getTeams,
    filterNewRounds,
    getGames,
    getStats
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

    // leagues table
    const leagues = getLeagueNames(gamesWithLeagues);

    const createdLeague = await knex(tableNames.league)
        .insert(leagues)
        .returning('*');

    console.log('Created Leagues', createdLeague);

    // teams table
    const teams = getTeams(gamesWithLeagues);

    const createdTeams = await knex(tableNames.team)
        .insert(teams)
        .returning('*');

    console.log(' Created teams: ', createdTeams);


    // weekly game hash table

    const alreadySavedWeeklyHashes1 = await knex(tableNames.weekly_game_hash).select('hash');

    const newWeeklyRounds = filterNewRounds(gamesWithLeagues, alreadySavedWeeklyHashes1);

    const hashesWithIds = await Promise.all(newWeeklyRounds
            .map(async item => {
                const id = await knex(tableNames.league).where('name',
                    item.leagueName).select('id').first();
                return {
                league_id: id.id,
                hash: item.hash
            }}));

    const createdHash = await knex(tableNames.weekly_game_hash)
        .insert(hashesWithIds)
        .returning('*');

    console.log('Created Hash', createdHash);

    const alreadySavedGameHash = await knex(tableNames.game).select('hash');
    // game table
    const games = getGames(newWeeklyRounds);
    const newGames = filterNewRounds(games, alreadySavedGameHash);

    const gamesWithIds = await Promise.all(newGames
        .map(async item => {
            const league_id = await knex(tableNames.league).where('name',
                item.leagueName).select('id').first();
            console.log(league_id);
            const home_team_id = await knex(tableNames.team).where('name',
                item.homeTeam).select('id').first();
            console.log(home_team_id);
            const away_team_id = await knex(tableNames.team).where('name',
                item.awayTeam).select('id').first();
            return {
                league_id: league_id.id,
                home_team_id: home_team_id.id,
                away_team_id: away_team_id.id,
                game_date: item.date,
                hash: item.hash,
            }
        }));

    const createdGames = await knex(tableNames.game)
        .insert(gamesWithIds)
        .returning('*');

    console.log(createdGames);

    // home stat table
    const homeStats = getStats(stats, 'home');
    const homeStatsWithIds = await Promise.all(homeStats.map(async item =>{
        const team_id = await knex(tableNames.team).where('name',
            item.teamName).select('id').first();
        const { teamName, ...onlyStats } = item;

        return {
            stat_available: true,
            team_id: team_id.id,
            ...onlyStats
        }
    }));

    const createdHomeStats = await knex(tableNames.weekly_home_stat)
        .insert(homeStatsWithIds)
        .returning('*');

    console.log(createdHomeStats);

    // away stat table
    const awayStats = getStats(stats, 'away');
    const awayStatWithIds = await Promise.all(awayStats.map(async item =>{
        const team_id = await knex(tableNames.team).where('name',
            item.teamName).select('id').first();
        const { teamName, ...onlyStats } = item;

        return {
            stat_available: true,
            team_id: team_id.id,
            ...onlyStats
        }
    }));

    const createdAwayStats = await knex(tableNames.weekly_away_stat)
        .insert(awayStatWithIds)
        .returning('*');

    console.log(createdAwayStats);

};
