const puppeteer = require('puppeteer');
const {organizeGameListsWithLeagues} = require("./rawListFinalizer");

const {
    getGamesOfThisWeek,
    getStats,
    loopNScrape,
    getLeagues,
} = require('./scrapeFunctions');



const {
    getLinkArray,
    getNestedLinkArray,
} = require('./utils');

const createScrapeFunctions = () => {
    let browser = null;

    const openBrowser = async (headless) => {
        browser = await puppeteer.launch({ headless });
    };

    const getCurrentlyListedGames = async () => {
        if (browser != null) {
            const page = await browser.newPage();
            await page.goto('https://www.soccerstats.com');
            const leagueList = await getLeagues(page);
            console.log('leagueList', leagueList);
            const rawGameLists = await loopNScrape(
                getGamesOfThisWeek,
                getLinkArray(leagueList, 'link'),
                browser);
            return  organizeGameListsWithLeagues(leagueList, rawGameLists);
        }
    };

    const getTeamStats = async (newGames) => {
        if(browser != null) {
            return await loopNScrape(
                getStats,
                getNestedLinkArray(newGames, 'games', 'linkToStats'),
                browser
            );
        }
    };

    const closeBrowser = async () => {
        if(browser != null) await browser.close();
    };

    return {
        openBrowser,
        getCurrentlyListedGames,
        getTeamStats,
        closeBrowser,
    };

};


module.exports = createScrapeFunctions();
