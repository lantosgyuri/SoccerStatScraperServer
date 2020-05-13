const {
    createGameListFromScrapedData
} = require('./rawListFinalizer');

const {
    delayExecution,
    throwError,
} = require('./utils');

const getLeagues = async (page) => {
    const LINK_SELECTOR = '#headerlocal > div:nth-child(2) > table > tbody > tr > td:nth-child(INDEX) > span > a';
    const CONTAINER_SELECTOR = '#headerlocal > div:nth-child(2) > table > tbody > tr > td:nth-child(INDEX)';

    let isRowEnd = false;
    let elementIndex = 1;
    const leagueDetailsList = [];

    while(!isRowEnd) {
        const LEAGUE_CONTAINER = CONTAINER_SELECTOR.replace('INDEX', elementIndex.toString());
        try {
            const childElementCount = await page.evaluate(sel => {
                return document.querySelector(sel).childNodes.length;
            }, LEAGUE_CONTAINER);
            if (childElementCount > 1) isRowEnd = true;
            else {
                let leagueDetails = {};
                const LEAGUE_LINK_SELECTOR = LINK_SELECTOR.replace('INDEX', elementIndex.toString());

                leagueDetails['link'] = await page.evaluate(sel => {
                    return document.querySelector(sel).href
                }, LEAGUE_LINK_SELECTOR);

                leagueDetailsList.push(leagueDetails);
                elementIndex ++;
            }
        } catch(e) {
            throwError('Error in the getLeagues function ')(e);
        }
    }
    return leagueDetailsList;
};

const getGamesOfThisWeek = async (page) => {
    const ROW_SELECTOR = '.eight.columns .trow2';
    const LINK_SELECTOR = '.eight.columns .trow2 a';
    const LEAGUE_NAME_SELECTOR = '#content > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(3) > h1';

    let gameList;
    let leagueName = '';

    try {
        leagueName = await page.evaluate(sel => document.querySelector(sel).innerText
            , LEAGUE_NAME_SELECTOR);
    } catch (e) {
        throwError('Error in the getGamesOfTheWeek function, can not get leagueName ')(e);
    }

    try {
        const rowCount = await page.evaluate(sel => Array.from(document.querySelectorAll(sel)).length
            , ROW_SELECTOR);

        if(rowCount <= 1) {
            gameList = [];
        } else {

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

            const linkList = await page.evaluate(sel => Array.from(document.querySelectorAll(sel))
                    .map(item => item.href)
                , LINK_SELECTOR);

            const rawGameList = createGameListFromScrapedData(scrapedGameData, linkList);
            gameList = rawGameList.map(item => Object.assign(item, { leagueName }))
        }
    } catch(e) {
        throwError('Error in the getGamesOfTheWeek function ')(e);
    }

    return { leagueName, gameList } ;
};

const getStats = async (page) => {
    const LEAGUE_NAME_SELECTOR = '#content > div:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(3) > font';
    const HOME_TEAM_NAME_SELECTOR = '#content > div:nth-child(8) > div.row > div.seven.columns > table:nth-child(9) > tbody > tr > td:nth-child(1) > font';
    const AWAY_TEAM_NAME_SELECTOR = '#content > div:nth-child(8) > div.row > div.seven.columns > table:nth-child(9) > tbody > tr > td:nth-child(2) > font';
    const ROW_SELECTOR = 'div.seven.columns tr[height="22"]';

    const namesToScrape = [
        { name: 'leagueName',
          selector: LEAGUE_NAME_SELECTOR,
        },
        { name: 'homeTeamName',
            selector: HOME_TEAM_NAME_SELECTOR,
        },
        { name: 'awayTeamName',
            selector: AWAY_TEAM_NAME_SELECTOR,
        },
    ];

    let scrapedNames = {};
    let stats = [];

    try {
        scrapedNames = await page.evaluate(
            selectorArray => selectorArray
                .map(item => {
                    let name = {};
                    name[item.name] = document.querySelector(item.selector).innerText;
                    return name;
                })
                .reduce((acc, item) => Object.assign(acc, item))
            , namesToScrape);

        stats = await page.evaluate(sel=> {
                const TD_SELECTOR = 'td[valign="middle"]';
                const allRows = Array.from(document.querySelectorAll(sel));
               // TODO IT WAS MODIFIED BUT NOT TESTED THE OLD VERSION WAS WITHOUT THE IF CHECK
                if(allRows && allRows.length > 15) {
                    const neededRows = allRows.splice(0,14);
                    return neededRows.map(node => {
                        let stat = {};
                        const data = Array.from(node.querySelectorAll(TD_SELECTOR))
                            .map(item => item.innerText);
                        stat[data[1]] = { homeStat: data[0], awayStat: data[2]};
                        return stat;
                    });
                }
            }
            , ROW_SELECTOR);
    } catch(e) {
        throwError('Error in the getStats function ')(e);
    }

    return Object.assign(scrapedNames, { stats })
};

const loopNScrape = async (scrapeFunction, linkList, browser) => {
    let scrapedDataList = [];
    for (let i = 0; i < linkList.length; i++) {
        const newPage = await browser.newPage();
        await newPage.goto(linkList[i]);
        const data = await scrapeFunction(newPage);
        await delayExecution();
        scrapedDataList.push(data);
        await newPage.close();
    }
    return scrapedDataList;
};

module.exports = {
    getGamesOfThisWeek,
    getStats,
    getLeagues,
    loopNScrape
};
