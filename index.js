const puppeteer = require('puppeteer');
const {
    getGamesOfThisWeek,
    scrapeStats,
    loopNScrape,
    getLeagues,
} = require('./scrapeFunctions');

const {
    getLinkArray
} = require('./utils');

const {
    organizeGameListsWithLeagues
} = require('./rawListFinalizer');

const scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.soccerstats.com/');
    const leagueList = await getLeagues(page);
    const rawGameLists = await loopNScrape(
        getGamesOfThisWeek,
        getLinkArray(leagueList, 'link'),
        browser);
    const gamesToSave = organizeGameListsWithLeagues(leagueList, rawGameLists);
    console.log('gamesToSave', gamesToSave);
    //SAVE IN DB THE GAMES if empty array dont save
    // check for the hashes before start scraping the stats
    // so filter out. the hashes are saved per league
    // also check in sql if the hash are not the same, but the game are the sme with different date
    // const statList = await loopNScrape(getStats, gameList, browser);
    // TODO: SAVE THE GAME LIST IN THE GAMES TABLE
    //const gameListWithStats = await scrapeStats(gameList);

    // will send the JSON to the mySQL service, the return value is a done or not done
   // TODO const saveStats = await saveStats(gameStats);
    await browser.close();
};


scrape();
