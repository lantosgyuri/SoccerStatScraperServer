const createRandomFunction = min => max => () => Math.floor(Math.random()* max) + min;
const createRandomMin1 = createRandomFunction(1000);
const getRandomSecBetween1To60 = createRandomMin1(60000);

const delay = sec => {
    return new Promise(resolve => setTimeout(resolve, sec));
};

const delayExecution = async () => await delay(getRandomSecBetween1To60());

const getLinkArray = (array, linkKey) => array.map(item => item[linkKey]);

module.exports = {
    getLinkArray,
    delayExecution
};
