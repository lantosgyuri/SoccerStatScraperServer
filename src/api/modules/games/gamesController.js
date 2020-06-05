const { getFilteredGamesFromDB } = require('../../../dbService/utils/dbOperations');
const { statNameHome, statNameAway } = require('../../../dbService/constants/statColumnNames');

/*
in:
{
  home: { avg_goals_for: 1.4, scoring_rate: 1.2 },
  away: { avg_goals_against: 1, conceding_rate: 15 }
}
out:
[[hst.avg_goals_for, 1.4], [hst.scoring_rate, 1.2]... ]
 */
const createQueryParams = (body) => {

};

const getFilteredGames = async (req,res) => {
    console.log(req.body);
    const params = [['hst.avg_goals_for', 1.9]];
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
