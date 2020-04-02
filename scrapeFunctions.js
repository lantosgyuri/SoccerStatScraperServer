const { getValidDate } = require('./utils');

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

const createGameListFromScrapedData = scrapedData => {
    const homeTeamData = scrapedData.filter(item => Object.keys(item).length > 1);
    const awayTeamData = scrapedData.filter(item => Object.keys(item).length === 1);

    const gameData = [];

    for(let i = 0; i < homeTeamData.length; i++) {
        gameData.push(Object.assign(homeTeamData[i], awayTeamData[i]))
    }

    return gameData;
} ;

const getGamesOfThisWeek = async (page) => {
    const ROW_SELECTOR = '.eight.columns .trow2';
    const LINK_SELECTOR = '.eight.columns .trow2 a';

    const rowCount = await page.evaluate(sel => Array.from(document.querySelectorAll(sel)).length
        , ROW_SELECTOR);

    if(rowCount <= 1) return [[], []];

    const scrapedGameData = await page.evaluate(sel =>
            Array.from(document.querySelectorAll(sel))
                .filter(node => node.childElementCount >= 8)
                .map(node => {
                    let gameDetails = {};

                    const getValidDate = (date, day) => {
                        const now = new Date();
                        const thisMonth = now.getMonth() + 1;
                        const thisYear = now.getFullYear();

                        const getDayString = date => date.toDateString().split(' ')[0];

                        let dateToReturn = new Date(`${thisMonth} ${date} ${thisYear}`);

                        let monthIncrease = 0;
                        while(day !== getDayString(dateToReturn)) {
                            dateToReturn = new Date(`${thisMonth + ++monthIncrease} ${date} ${thisYear}`)
                        }

                        return dateToReturn.toDateString()
                    };

                    if (node.childElementCount === 11) {
                        const [day, date] = node.querySelector('td[bgcolor="#cccccc"]').innerText.split('\n');
                        gameDetails['date'] = getValidDate(date, day);
                        gameDetails['homeTeam'] = node.querySelector('td[align=right]').innerText.trim();
                    }
                    gameDetails['awayTeam'] = node.querySelector('td[align=right]').innerText.trim();
                    return gameDetails;
                })
    , ROW_SELECTOR);

    const gameList = createGameListFromScrapedData(scrapedGameData);
    console.log(gameList);
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
