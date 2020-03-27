const puppeteer = require('puppeteer');
const { removeNewLine } = require('./utils');

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.soccerstats.com/results.asp?league=germany&pmtype=month4');
    // will be list with links
    const gameList = await getGamesOfThisWeek(page);
    // TODO will be a JSON object with the stats
   // const gameStats = await scrapeStats(gameList);
    // will send the JSON to the mySQL service, the return value is a done or not done
   // TODO const saveStats = await saveStats(gameStats);
    await browser.close();
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
                    scrapedData = await page.evaluate(sel =>
                            document.querySelector(sel).getAttribute('href'),
                        item.selector.replace('INDEX', elementIndex.toString()));
                } else {
                    scrapedData = await page.evaluate(sel =>
                            document.querySelector(sel).innerHTML,
                        item.selector.replace('INDEX', elementIndex.toString()));
                }
                gameDetails[key] = removeNewLine(scrapedData);
            }
            console.log(`scraped object:`, gameDetails);
            elementIndex++;
        }
        console.log(`gamerowindex ${elementIndex} gamerowCount ${gameRowCount}`);
    }
};


scrape();
//HOME TEAM goes with index
//#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(3)
//#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(3)


//#content > div:nth-child(5) > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td > table > tbody
// https://www.soccerstats.com/results.asp?league=germany&pmtype=month4
