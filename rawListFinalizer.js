const crypto = require('crypto');

const createHash = text => crypto.createHash('md5')
    .update(text)
    .digest('hex');

const createGameListFromScrapedData = (scrapedData, linkList) => {
    const homeTeamData = scrapedData.filter(item => Object.keys(item).length > 1);
    const awayTeamData = scrapedData.filter(item => Object.keys(item).length === 1);

    const gameData = [];

    for(let i = 0; i < homeTeamData.length; i++) {
        gameData.push(Object.assign(homeTeamData[i], awayTeamData[i], { linkToStats: linkList[i] }));
    }

    const gameDataWitHashes = gameData.map(item =>{
        const hash = createHash(`${item.homeTeam} ${item.awayTeam} ${item.date}`);
        return Object.assign(item, { hash });
    });

    return gameDataWitHashes;
} ;

const organizeGameListsWithLeagues = (leagueList, rawGameList) => {
    let organizedList = [];

    const createHashForGameTable = gameArray => {
        if (gameArray.length < 1) {
            return 'no hash';
        } else {
            return createHash(rawGameList.reduce(
                (accumulatedHash, currentObject) => accumulatedHash.concat(currentObject.hash), ''));
        }
    };

    leagueList.forEach((item, index) => {
        const currentGameList = rawGameList[index];
        const leagueWithGames = Object.assign(item, { games: currentGameList });
        const leagueWitHashAndGames = Object.assign(
            leagueWithGames,
            { hash: createHashForGameTable(currentGameList) });
        organizedList.push(leagueWitHashAndGames);
    });

    return organizedList;
};

module.exports = {
    createGameListFromScrapedData,
    organizeGameListsWithLeagues,
};
