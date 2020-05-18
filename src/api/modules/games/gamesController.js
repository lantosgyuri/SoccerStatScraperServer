const { getFilteredGamesFromDB } = require('../../../dbService/utils/dbOperations');

const getFilteredGames = async (req,res) => {
    try {
        // cerate a base query body
        const games = await getFilteredGamesFromDB();
        res.status(200).json({ games });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getFilteredGames,
};
