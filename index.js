const fs = require('fs');

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

const scrape = async () => {
    await openBrowser(false);
    try {
        const currentlyListedGames = await getCurrentlyListedGames();
        fs.writeFileSync('./newLeagues34.json', JSON.stringify(currentlyListedGames));
        const newRounds = await updateGamesAndLeaguesInDB(currentlyListedGames);
        const newTeamStats = await getTeamStats(newRounds);
        fs.writeFileSync('./newStats34.json', JSON.stringify(newTeamStats));
        await updateStatsInDB(newTeamStats);
    } catch (e) {
        console.log(e);
    }

    await closeBrowser();
};

//scrape();

const port = process.env.port || 5050;
app.listen(port, () => {
   console.log(`App is listening at port ${port}`)
});

