const removeNewLine = text => text.replace(new RegExp('\n', 'g'), '');

module.exports = { removeNewLine, parseDate };
