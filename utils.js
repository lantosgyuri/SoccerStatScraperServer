const removeNewLine = text => text.replace(new RegExp('\n', 'g'), '');

const createFullLink = link => `https://www.soccerstats.com${link}`;

module.exports = { removeNewLine, createFullLink };
