const { getHomeTeamStatFromDB, getAwayTeamStatFromDB } =require('../../../dbService/utils/dbOperations');

const getStatForTeam = async (req, res) => {
    // TODO add validation
    const teamID = req.params.teamID;
    const state = req.params.state;
    const statQuery = state === 'home' ? getHomeTeamStatFromDB : getAwayTeamStatFromDB;

    try {
        const stats = await statQuery(teamID);
        res.status(200).json({ teamID, state, stats });
    } catch(e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getStatForTeam,
};
