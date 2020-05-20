const { getFilteredGamesFromDB } = require('../../../dbService/utils/dbOperations');

const getFilteredGames = async (req,res) => {
    try {
        const games = await getFilteredGamesFromDB();
        res.status(200).json({ games, length: games.length });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getFilteredGames,
};
