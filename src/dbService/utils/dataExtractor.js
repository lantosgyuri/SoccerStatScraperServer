const getLeagueNames = leagueArray => leagueArray.map(item => ({ name: item.leagueName }));

const getTeams = leagueArray => leagueArray.reduce((acc, item) => {
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

const filterNewRounds = (newArray, savedHashes) => {
    const leaguesWithHashes = newArray.filter(item => item.hash !== 'no hash');
    return leaguesWithHashes
        .filter(newHash => !savedHashes
            .some(oldHash => oldHash.hash === newHash.hash));
};

const getGames = filteredLeagues => filteredLeagues
    .filter(item => item.games.length > 0)
    .reduce((acc, item) => acc.concat(item.games), []);

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


module.exports = {
    getLeagueNames,
    getTeams,
    filterNewRounds,
    getGames,
    getStats,
};
