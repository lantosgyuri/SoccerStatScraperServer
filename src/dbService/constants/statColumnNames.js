const statColumnNames = {
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

const statFieldInfo = {
   types : {
       num: {
           minValue: 0,
           maxValue: 10,
       },
       percentage: {
           minValue: 0,
           maxValue: 1,
       }
   },
    fields: [
        {
            name: 'Average goals for',
            dbColumnName: 'avg_goals_for',
            type: 'num',
        },
        {
            name: 'Clean sheets',
            dbColumnName: 'clean_sheets',
            type: 'percentage',
        },
        {
            name: 'Won to nil',
            dbColumnName: 'won_to_nil',
            type: 'percentage',
        },
        {
            name: 'Scoring rate',
            dbColumnName: 'scoring_rate',
            type: 'percentage',
        },
        {
            name: 'Scored in both halves',
            dbColumnName: 'scored_in_both_halves',
            type: 'percentage',
        },
        {
            name: 'Team scored first',
            dbColumnName: 'team_scored_first',
            type: 'percentage',
        },
        {
            name: 'Leading at halftime',
            dbColumnName: 'leading_at_halftime',
            type: 'percentage',
        },
        {
            name: 'Average goals against',
            dbColumnName: 'avg_goals_against',
            type: 'num',
        },
        {
            name: 'Failed to score',
            dbColumnName: 'failed_to_score',
            type: 'percentage',
        },
        {
            name: 'Lost to nil',
            dbColumnName: 'lost_to_nil',
            type: 'percentage',
        },
        {
            name: 'Conceding rate',
            dbColumnName: 'conceding_rate',
            type: 'percentage',
        },
        {
            name: 'Conceded in both halves',
            dbColumnName: 'conceded_in_both_halves',
            type: 'percentage',
        },
        {
            name: 'Opponent scored first',
            dbColumnName: 'opponent_scored_first',
            type: 'percentage',
        },
        {
            name: 'Losing at halftime',
            dbColumnName: 'losing_at_halftime',
            type: 'percentage',
        },
   ]
};

const addTeamPrefix = (preFix, nameObj) => Object.entries(nameObj)
    .reduce((acc, item) => {
        const currentKey = item[0];
        const currentEntry = item[1];
        acc[currentKey] = `${preFix}.${currentEntry}`;
        return acc;
    } , {});

module.exports = {
    statNameHome: addTeamPrefix('hst', statColumnNames),
    statNameAway: addTeamPrefix('ast', statColumnNames),
    statColumnNames,
    statFieldInfo,
};
