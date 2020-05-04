const getLeaguesWithHash = leaguesInfo => leaguesInfo
    .filter(league => league.hash !== 'no hash')
    .map(league => ({ name: league.name, hash: league.hash }));

const getLeagueNames = leagues => leagues
    .map(league => ({name: league.name}));

const createInsertReadyWeeklyHash = (weeklyGameHash, leagueIds) => weeklyGameHash
    .map((item, index) => ( {
        league_id: leagueIds[index].id,
        hash: item.hash
    }));

module.exports = {
    getLeaguesWithHash,
    getLeagueNames,
    createInsertReadyWeeklyHash,
};
