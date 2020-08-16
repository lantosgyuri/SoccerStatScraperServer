# SoccerStatScraperServer

This is a simple server for scraping soccerstats.com. 

## Run

Just run the docker-compose file. 

## API routes

**POST api/v1/games/filter**

You can filter games by the statistics. The API will search for games where the params are bigger as the params set in the body.

Body: 
"home" : {
  "avg_goals_for": "0.4",
	"clean_sheets": "0.2",
},
"away": {
	"avg_goals_against": "1",
	"failed_to_score": "0.3",
}

**GET api/v1/stat/team/:teamID/:state**

State must be "home" or "away".
Returns the team statistic of a team, based on Home or Away games.

**GET api/v1/stat/available-field**

Returns all of the available fields which you can use in the *api/v1/games/filter* route.
