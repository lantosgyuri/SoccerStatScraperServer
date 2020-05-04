const {
    getCurrentlyListedGames,
    getTeamStats,
    openBrowser,
    closeBrowser,
} = require('./src/scrapeService');

const {
    updateGamesInDB,
    updateStatsInDB,
} = require('./src/dbService');

const fs = require('fs');

const scrape = async () => {
    await openBrowser(false);
    try {
        const currentlyListedGames = await getCurrentlyListedGames();
       // fs.writeFileSync('./new1.json', JSON.stringify(currentlyListedGames));
        //const newGames = await updateGamesInDB(currentlyListedGames);
        const newTeamStats = await getTeamStats(currentlyListedGames);
       // fs.writeFileSync('./new2.json', JSON.stringify(newTeamStats));
        //await updateStatsInDB(newTeamStats);
    } catch (e) {
        console.log(e);
    }

    await closeBrowser();
};


scrape();
