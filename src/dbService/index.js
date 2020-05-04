const {
    getLeaguesWithHash,
    getLeagueNames,
} = require('./utils/dataExtractor');

const {
    updateLeagueNames,
    updateWeeklyGameHash,
    updateGames,
} = require('./utils/dbOperations');

const updateGamesInDB = async leaguesInfo => {
    // TODO add try catch throw own error
    await updateLeagueNames(getLeagueNames(leaguesInfo));
    const leaguesWithHash = getLeaguesWithHash(leaguesInfo);
    const newRounds = updateWeeklyGameHash(leaguesWithHash);
    return await updateGames(newRounds);
};

const updateStatsInDB = () => {};

module.exports = {
    updateGamesInDB,
    updateStatsInDB,
};
