const { removeNewLine, createFullLink } = require('./utils');

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

const getGamesOfThisWeek = async (page) => {
    const GAME_ROW_SELECTOR = '#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(INDEX)';
    const DATE_SELECTOR = '#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(INDEX) > td:nth-child(1) > font';
    const TIME_SELECTOR = '#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(INDEX) > td:nth-child(2) > font';
    const HOME_TEAM_SELECTOR = '#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(INDEX) > td:nth-child(3)';
    const AWAY_TEAM_SELECTOR = '#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(INDEX) > td:nth-child(5)';
    const LINK_SELECTOR = '#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(INDEX) > td:nth-child(4) > a';

    const dataBeScraped = [
        {   name: 'date',
            selector: DATE_SELECTOR,
        },
        {   name: 'time',
            selector: TIME_SELECTOR
        },
        {   name: 'homeTeam',
            selector: HOME_TEAM_SELECTOR
        },
        {   name: 'awayTeam',
            selector: AWAY_TEAM_SELECTOR
        },
        {   name: 'linkToStats',
            selector: LINK_SELECTOR
        }
    ];

    let isTableEnd = false;
    // the 3. children is the first element
    let elementIndex = 3;
    const gameDetailsList = [];
    while (!isTableEnd){
        const GAME_ROW = GAME_ROW_SELECTOR.replace('INDEX', elementIndex.toString());
        const gameRowCount = await page.evaluate(sel => {
            return document.querySelector(sel).childElementCount;
        }, GAME_ROW);
        if (gameRowCount < 4) isTableEnd = true;
        else {
            let gameDetails = {};
            for (const item of dataBeScraped) {
                const key = item.name;
                let scrapedData;
                if (key === 'linkToStats') {
                    const rowScrapedLink = await page.evaluate(sel =>
                            document.querySelector(sel).getAttribute('href'),
                        item.selector.replace('INDEX', elementIndex.toString()));
                    scrapedData = createFullLink(rowScrapedLink);
                } else {
                    scrapedData = await page.evaluate(sel =>
                            document.querySelector(sel).innerHTML,
                        item.selector.replace('INDEX', elementIndex.toString()));
                }
                gameDetails[key] = removeNewLine(scrapedData);
            }
            gameDetailsList.push(gameDetails);
            elementIndex++;
        }
    }
    return gameDetailsList;
};

const scrapeStats = async (gameList) => {
    const linkList = gameList.map(gameData => gameData.linkToStats);

    for (const link in linkList) {
        const page = await browser.newPage();
        await page.goto(link);
        const scrapedStats = scrapeTeamStats(page);
        page.close();
    }
};

module.exports = { getGamesOfThisWeek, scrapeStats, getLeagues };
