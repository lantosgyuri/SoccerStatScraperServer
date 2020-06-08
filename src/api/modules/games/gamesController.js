const { getFilteredGamesFromDB } = require('../../../dbService/utils/dbOperations');

const createQueryParams = (body) => {
    const addPrefix = (names, prefix) => names.map(item => [`${prefix}.${item[0]}`, item[1]]);
    const homeParamsRaw = Object.entries(body.home);
    const awayParamsRaw = Object.entries(body.away);
    const homeParams = addPrefix(homeParamsRaw, 'hst');
    const awayParams = addPrefix(awayParamsRaw, 'ast');
    return homeParams.concat(awayParams);
};

const getFilteredGames = async (req,res) => {
    // TODO validate body
    const params = createQueryParams(req.body);
    try {
        const games = await getFilteredGamesFromDB(params);
        res.status(200).json({ games, length: games.length });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getFilteredGames,
};
