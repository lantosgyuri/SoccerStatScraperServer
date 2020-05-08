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
const kettes = require('../../scrapeService/scrapeResponseSamples/kettes');

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

 // TODO HERE START THE UNCOMMITED STUFF

    async function upsertDoNothing(conflictingFields, tableName, dataToBeInserted) {
        return await knex.raw(
            `? ON CONFLICT (${conflictingFields})
            DO NOTHING
            RETURNING *;`,
            [knex(tableName).insert(dataToBeInserted)],
        );
    }

    const leagues2 = kettes.map(item => ({ name: item.leagueName }));

    const createdLeague2 = await upsertDoNothing(
      'name', tableNames.league, leagues2
    );

    const teams2 = getTeams(kettes);

    const createdTeams2 = await upsertDoNothing(
        'name', tableNames.team, teams2
    );

    console.log('Created Leagues2', createdLeague2);
    console.log('Created Teams2', createdTeams2);

    const alreadySavedWeeklyHashes = await knex(tableNames.weekly_game_hash).select('hash');

    console.log(alreadySavedWeeklyHashes);

    const leaguesWithHashes2 = kettes
        .filter(newHash=> newHash.hash !== 'no hash');

    const newWeeklyRounds2 = leaguesWithHashes2
        .filter(newHash => !alreadySavedWeeklyHashes
            .some(oldHash => oldHash.hash === newHash.hash));

    console.log('!!!!! NEWWEEKLY', newWeeklyRounds2);

    const hashesWithIds2 = await Promise.all(newWeeklyRounds2
        .map(async item => {
            const id = await knex(tableNames.league).where('name',
                item.leagueName).select('id').first();
            return {
                league_id: id.id,
                hash: item.hash
            }}));

    console.log(hashesWithIds2);

    const createdHash2 = await knex(tableNames.weekly_game_hash)
        .insert(hashesWithIds2)
        .returning('*');

    console.log('Created Hash', createdHash2);

    // TODO at the moment I have saved everything what needed I know the new hashes.
    // TODO NEWEEKLYROUNDS2

    const alreadySavedGameHash1 = await knex(tableNames.game).select('hash');

    const games1 = getGames(newWeeklyRounds2);
    console.log('!!!', games1);
    const newGames1 = filterNewRounds(games1, alreadySavedGameHash1);

    console.log('!!!!!', newGames1);



};
