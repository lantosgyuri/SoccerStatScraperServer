const {
    getLeagueNames,
    getTeams,
    filterNewRounds,
    getGames,
    getStats,
} = require('./utils/dataExtractor');

const {
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
} = require('./utils/dbOperations');

const createInsertReadyStatObject = stats => async team => {
    const teamStat = getStats(stats, team);
    return await Promise.all(teamStat.map(async item =>{
        const team_id = await getTeamIdWhereNameFromDB(item.teamName);
        const { teamName, ...onlyStats } = item;

        return {
            stat_available: true,
            team_id: team_id.id,
            ...onlyStats
        }
    }));
};

const updateGamesAndLeaguesInDB = async currentlyListedGames => {
    const leagues = getLeagueNames(currentlyListedGames);
    await insertIntoLeagues(leagues);

    const teams = getTeams(currentlyListedGames);
    await insertIntoTeams(teams);

    const alreadySavedHashes = await getWeeklyGameHashFromDB();
    const newWeeklyRounds = filterNewRounds(currentlyListedGames, alreadySavedHashes);
    const hashesWithIds = await Promise.all(newWeeklyRounds
        .map(async item => {
            const id = await getLeagueIdWhereNameFromDB(item.leagueName);
            return {
                league_id: id.id,
                hash:item.hash
            }
        }));
    await insertIntoWeeklyGameHash(hashesWithIds);

    const games = getGames(newWeeklyRounds);
    const alreadySavedGameHash = await getGameHashFromDB();
    const newGames = filterNewRounds(games, alreadySavedGameHash);
    const gamesWithIds = await Promise.all(newGames
        .map(async item => {
            const league_id = await getLeagueIdWhereNameFromDB(item.leagueName);
            const home_team_id = await getTeamIdWhereNameFromDB(item.homeTeam);
            const away_team_id = await getTeamIdWhereNameFromDB(item.awayTeam);
            return {
                league_id: league_id.id,
                home_team_id: home_team_id.id,
                away_team_id: away_team_id.id,
                game_date: item.date,
                hash: item.hash,
            }
        }));

    await insertIntoGames(gamesWithIds);

    return newWeeklyRounds;
};

const updateStatsInDB = async teamStats => {
    const createStatObject = createInsertReadyStatObject(teamStats);
    const homeStats = await createStatObject('home');
    const awayStats = await createStatObject('away');

    await insertIntoHomeStat(homeStats);
    await insertIntoAwayStat(awayStats);
};

module.exports = {
    updateGamesAndLeaguesInDB,
    updateStatsInDB,
};
