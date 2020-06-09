const { getHomeTeamStatFromDB, getAwayTeamStatFromDB } =require('../../../dbService/utils/dbOperations');

const getStatForTeam = async (req, res, next) => {
    const teamID = req.params.teamID;
    const state = req.params.state;

    if(state !== 'away' && state !== 'home') {
        const error = new Error(`You have to add 'home' or 'away' param`);
        res.status(400);
        next(error);
    }

    if(Number.isNaN(Number(teamID))) {
        const error = new Error(`You have to add a valid number`);
        res.status(400);
        next(error);
    }

    const statQuery = state === 'home' ? getHomeTeamStatFromDB : getAwayTeamStatFromDB;

    try {
        const stats = await statQuery(teamID);
        res.status(200).json({ teamID, state, stats });
    } catch(e) {
        const error = new Error(e.message);
        res.status(400);
        next(error);
    }
};

module.exports = {
    getStatForTeam,
};
