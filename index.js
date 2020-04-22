const {
    getCurrentlyListedGames,
    getTeamStats,
    openBrowser,
    closeBrowser,
} = require('./scrape');

const scrape = async () => {
    await openBrowser(true);
    try {
        const currentlyListedGames = await getCurrentlyListedGames();

        // TODO IF SOMETHINGIS NOT THERE IT RETURNED AN EMPTY ARRAY

        // TODO : return the league hasehes what needs to be update
        // TODO : save the games and stats what needs to be updated
        // TODO : only get the stats for the games what needs to be updated
        const teamStats = await getTeamStats(currentlyListedGames);
    } catch (e) {
        // TODO HANDLE ERROR
        console.log('error is ', e);
    }

    // TODO : update the team stats
    await closeBrowser();
};


scrape();
