const puppeteer = require('puppeteer');
const { getGamesOfThisWeek, scrapeStats, getLeagues } = require('./scrapeFunctions');

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.soccerstats.com/');
    const leagueList = await getLeagues(page);
    // TODO: ADD LEAGUE ALSO TO THE GAME LIST
    //const gameList = await getGamesOfThisWeek(page);
    // TODO: SAVE THE GAME LIST IN THE GAMES TABLE
    //const gameListWithStats = await scrapeStats(gameList);
    // will send the JSON to the mySQL service, the return value is a done or not done
   // TODO const saveStats = await saveStats(gameStats);
    await browser.close();
};

scrape();
// https://www.soccerstats.com/results.asp?league=germany&pmtype=month4
