const puppeteer = require('puppeteer');
const {
    getGamesOfThisWeek,
    scrapeStats,
    getLeagues,
} = require('./scrapeFunctions');

const scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.soccerstats.com/latest.asp?league=germany');
    //const leagueList = await getLeagues(page);


    const [gameLists, linkToStats] = await getGamesOfThisWeek(page);
    // const gameList = await loopNScrape(getGamesOfThisWeek, leagueList, browser);
    //SAVE IN DB THE GAMES if empty array dont save
    // check for the hashes before start scraping the stats
    // so filter out. the hashes are saved per league
    // const statList = await loopNScrape(getStats, gameList, browser);
    // TODO: SAVE THE GAME LIST IN THE GAMES TABLE
    //const gameListWithStats = await scrapeStats(gameList);

    // will send the JSON to the mySQL service, the return value is a done or not done
   // TODO const saveStats = await saveStats(gameStats);
    await browser.close();
};


scrape();
// https://www.soccerstats.com/results.asp?league=germany&pmtype=month4
