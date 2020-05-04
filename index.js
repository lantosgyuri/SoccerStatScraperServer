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

const scrape = async () => {
    await openBrowser(true);
    try {
        const currentlyListedGames = await getCurrentlyListedGames();
        //const newGames = await updateGamesInDB(currentlyListedGames);
        //const newTeamStats = await getTeamStats(newGames);
        //await updateStatsInDB(newTeamStats);
    } catch (e) {
        console.log(e);
    }

    await closeBrowser();
};


scrape();
