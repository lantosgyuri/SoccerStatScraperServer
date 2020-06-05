const statColumNames = {
    avg_goals_for:  'avg_goals_for',
    clean_sheets: 'clean_sheets',
    won_to_nil: 'won_to_nil',
    scoring_rate: 'scoring_rate',
    scored_in_both_halves: 'scored_in_both_halves',
    team_scored_first: 'team_scored_first',
    leading_at_halftime: 'leading_at_halftime',
    avg_goals_against: 'avg_goals_against',
    failed_to_score: 'failed_to_score',
    lost_to_nil: 'lost_to_nil',
    conceding_rate: 'conceding_rate',
    conceded_in_both_halves: 'conceded_in_both_halves',
    opponent_scored_first: 'opponent_scored_first',
    losing_at_halftime: 'losing_at_halftime',
};

const addTeamPrefix = (preFix, nameObj) => Object.entries(nameObj)
    .reduce((acc, item) => {
        const currentKey = item[0];
        const currentEntry = item[1];
        acc[currentKey] = `${preFix}.${currentEntry}`;
        return acc;
    } , {});

module.exports = {
    statNameHome: addTeamPrefix('hst', statColumNames),
    statNameAway: addTeamPrefix('ast', statColumNames),
};
