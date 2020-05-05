const Knex = require('knex');
const tableNames = require('../constants/tableNames');

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
    const leagues = gamesWithLeagues.map(item => ({ name: item.leagueName }));

    const createdLeague = await knex(tableNames.league)
        .insert(leagues)
        .returning('*');

    console.log('Created Leagues', createdLeague);

    // teams table
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


    // weekly game hash table
    const weeklyGameHash = gamesWithLeagues.filter(item => item.hash !== 'no hash');

    const hashesWithIds = await Promise.all(weeklyGameHash
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

    // game table
    const games = gamesWithLeagues
        .filter(item => item.games.length > 0)
        .reduce((acc, item) => acc.concat(item.games), []);

    const gamesWithIds = await Promise.all(games
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

    // stat tables
    const createNameWithUnderScore = text => text.toLowerCase().replace(/ |-/g, '_');
    const createNumeric = text => {
        if(text.includes('%')) {
            return parseFloat(text) / 100;
        }
        return parseFloat(text);
    };

    const getStats = (stats, team) => {
        let teamNameKey;
        let teamStatKey;
        if(team === 'home') {
            teamNameKey = 'homeTeamName';
            teamStatKey = 'homeStat';
        } else {
            teamNameKey = 'awayTeamName';
            teamStatKey = 'awayStat';
        }

        return stats.map(item => {
            const teamName = item[teamNameKey];
            const stats = item.stats.reduce((acc, itemStat) => {
                const key = Object.keys(itemStat)[0];
                const currentStatName = createNameWithUnderScore(key);
                const currentStat = createNumeric(itemStat[key][teamStatKey]);
                let stat = {};
                stat[currentStatName] = currentStat;
                return Object.assign(acc, { ...stat })
            }, {});
            return Object.assign({ teamName }, stats) });
    };

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
