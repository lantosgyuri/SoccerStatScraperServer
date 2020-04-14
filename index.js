const fs = require('fs');
const puppeteer = require('puppeteer');
const {
    getGamesOfThisWeek,
    getStats,
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
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.soccerstats.com');
    const leagueList = await getLeagues(page);
    const rawGameLists = await loopNScrape(
        getGamesOfThisWeek,
        getLinkArray(leagueList, 'link'),
        browser);
    const gamesToSave = organizeGameListsWithLeagues(leagueList, rawGameLists);
    fs.writeFileSync('./templateJson/organizeGameListsWithLeagues.json', JSON.stringify(gamesToSave, null, " "), 'utf-8');

    //SAVE IN DB THE GAMES if empty array dont save
    // const statsToUpdate = compare hashes, get back leagues where update needed

    // const statList = await getStats(page);

    /* const teamStats = await loopNScrape(
     getStats,
     getLinkArray(statsToUpdate, 'games', 'linkToStats')
     );
      And this will give back an array with every team stat, the DB handler should select out
      */

    // will send the JSON to the mySQL service, the return value is a done or not done
   // TODO const saveStats = await saveStats(gameStats);
    await browser.close();
};


scrape();
