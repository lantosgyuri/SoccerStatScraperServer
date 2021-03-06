const cron = require('node-cron');

const {
    getCurrentlyListedGames,
    getTeamStats,
    openBrowser,
    closeBrowser,
} = require('./src/scrapeService');

const {
    updateGamesAndLeaguesInDB,
    updateStatsInDB,
} = require('./src/dbService');

const app = require('./src/api/app');

// TODO BETTER ERROR HANDLING
const scrape = async () => {
    await openBrowser(true);
    try {
        const currentlyListedGames = await getCurrentlyListedGames();
        const newRounds = await updateGamesAndLeaguesInDB(currentlyListedGames);
        const newTeamStats = await getTeamStats(newRounds);
        await updateStatsInDB(newTeamStats);
    } catch (e) {
        console.log(e);
    }

    await closeBrowser();
};

cron.schedule('0 8 * * *', () => {
    scrape();
});

// scrape();

const port = process.env.port || 5050;
app.listen(port, () => {
   console.log(`App is listening at port ${port}`)
});

