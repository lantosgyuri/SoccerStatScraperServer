const { filterRows } = require('./utils');

const getLeagues = async (page) => {
    const LEAGUE_SELECTOR = '#headerlocal > div:nth-child(2) > table > tbody > tr > td:nth-child(INDEX) > span';
    const LINK_SELECTOR = '#headerlocal > div:nth-child(2) > table > tbody > tr > td:nth-child(INDEX) > span > a';
    const CONTAINER_SELECTOR = '#headerlocal > div:nth-child(2) > table > tbody > tr > td:nth-child(INDEX)';

    let isRowEnd = false;
    let elementIndex = 1;
    const leagueDetailsList = [];

    while(!isRowEnd) {
        const LEAGUE_CONTAINER = CONTAINER_SELECTOR.replace('INDEX', elementIndex.toString());
        const childElementCount = await page.evaluate(sel => {
            return document.querySelector(sel).childNodes.length;
        }, LEAGUE_CONTAINER);
        if (childElementCount > 1) isRowEnd = true;
        else {
            let leagueDetails = {};
            const LEAGUE_LINK_SELECTOR = LINK_SELECTOR.replace('INDEX', elementIndex.toString());
            const LEAGUE_NAME_SELECTOR = LEAGUE_SELECTOR.replace('INDEX', elementIndex.toString());

            leagueDetails['name'] = await page.evaluate(sel => {
                return document.querySelector(sel).title
            }, LEAGUE_NAME_SELECTOR);
            leagueDetails['link'] = await page.evaluate(sel => {
                return document.querySelector(sel).href
            }, LEAGUE_LINK_SELECTOR);

            console.log(leagueDetails);
            elementIndex ++;
        }
    }

    return leagueDetailsList;
};

const scrapeGameDetails = node => {
    let gameDetails = {};
    if (node.childElementCount === 11) {
        gameDetails['date'] =
    }

    gameDetails['status'] = node.querySelector('td[height="20"]').innerText.trim();
    gameDetails['teamName'] = node.querySelector('td[align=right]').innerText.trim();
    return gameDetails;
};

const filterOutRowsWithGames = node => node.childElementCount >= 8;

const createGameListFromScrapedData = scrapedData =>

const getGamesOfThisWeek = async (page) => {
    // Get all of the rows document.querySelectorAll('.eight.columns .trow2')
    const ROW_SELECTOR = '.eight.columns .trow2';
    const LINK_SELECTOR = '.eight.columns .trow2 a';

    const rowCount = await page.evaluate(sel => Array.from(document.querySelectorAll(sel)).length
        , ROW_SELECTOR);

    if(rowCount <= 1) return [[], []];

    const scrapedGameData = await page.evaluate(sel =>
            Array.from(document.querySelectorAll(sel))
                .filter(filterOutRowsWithGames)
                .map(scrapeGameDetails)
    , ROW_SELECTOR);

    const gameList = createGameListFromScrapedData(scrapedGameData);
    const linkList = await page.evaluate(sel => Array.from(document.querySelectorAll(sel))
        .map(item => item.href)
        , LINK_SELECTOR);

    return [gameList, linkList];
};

const getStats = async (gameList) => {
    const linkList = gameList.map(gameData => gameData.linkToStats);

    for (const link in linkList) {
        const page = await browser.newPage();
        await page.goto(link);
        const scrapedStats = scrapeTeamStats(page);
        page.close();
    }
};

const loopNScrape = async (scrapeFunction, listToBeExtended, browser) => {
    let extendedList = [];
    // handle empty array, if the games are not present

    for (const item in listToBeExtended) {
        const newPage = await browser.newPage();
        await newPage.goto('item.link');
        const data = await scrapeFunction(newPage);
        extendedList.push(data);
        newPage.close();

    }
    return extendedList;
};

module.exports = {
    getGamesOfThisWeek,
    getStats,
    getLeagues,
    loopNScrape
};
