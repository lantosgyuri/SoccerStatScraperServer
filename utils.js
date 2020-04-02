const removeNewLine = text => text.replace(new RegExp('\n', 'g'), '');

const createFullLink = link => `https://www.soccerstats.com${link}`;

const filterRows = rowList => rowList.map(item => item.innerText).filter(item => item.split(' ') > 3);

module.exports = {  createFullLink, filterRows};
