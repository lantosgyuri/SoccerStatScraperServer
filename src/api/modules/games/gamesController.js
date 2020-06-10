const { getFilteredGamesFromDB } = require('../../../dbService/utils/dbOperations');

const createQueryParams = (body) => {

     const addPrefix = (names, prefix) => names
         .map(item => [`${prefix}.${item[0]}`, item[1]]);

     const getEntriesOrEmpty = (hasIt, propName) => hasIt
         ? Object.entries(body[propName])
         : [];

    const hasHome = body.hasOwnProperty('home');
    const hasAway = body.hasOwnProperty('away');

    const homeParamsRaw = getEntriesOrEmpty(hasHome, 'home');
    const awayParamsRaw = getEntriesOrEmpty(hasAway, 'away');
    const homeParams = addPrefix(homeParamsRaw, 'hst');
    const awayParams = addPrefix(awayParamsRaw, 'ast');
    return homeParams.concat(awayParams);
};

const getFilteredGames = async (req, res, next) => {
    const params = createQueryParams(req.body);
    try {
        const games = await getFilteredGamesFromDB(params);
        console.log('games', games.length);
        res.status(200).json({ length: games.length, games  });
    } catch (e) {
        const error = new Error(e.message);
        res.status(400);
        next(error);
    }
};

module.exports = {
    getFilteredGames,
};
