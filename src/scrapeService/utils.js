const createRandomFunction = min => max => () => Math.floor(Math.random()* max) + min;
const createRandomMin1Sec = createRandomFunction(1000);
const getRandomSecBetween1To60 = createRandomMin1Sec(10000);
const delay = sec => {
    return new Promise(resolve => setTimeout(resolve, sec));
};
const delayExecution = async () => await delay(getRandomSecBetween1To60());

const getLinkArray = (array, linkKey) => array.map(item => item[linkKey]);

const getNestedLinkArray = (array, objectKey, linkKey) => Array.prototype.concat.apply([],
    array.map(item => getLinkArray(item[objectKey], linkKey)));

const throwError = errorText => (error = '') => {
    throw new Error(`${errorText} ${error}`)
};

module.exports = {
    getLinkArray,
    getNestedLinkArray,
    delayExecution,
    throwError,
};
