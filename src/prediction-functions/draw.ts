import { betOptionsEnum } from "../enums/bet-options.enums";
import { betOptionModel } from "../models/bet-option-model";
import { FixtureDataModel } from "../models/fixtures";
import { StandingsDataStandingModel, StandingsModel } from "../models/standings-models";
import { betOptions } from "../data-config/data-config";
import { getLastFiveHomeTeamHomeFixtures, againstAwayTeamGoalsPercentage, homeTeamGoalsPercentage, getH2HFixtures, 
  againstHomeTeamGoalsPercentage, getAwayTeamStanding, getHomeTeamStanding, getLastFiveAwayTeamAwayFixtures, 
  drawsInPreviousAwayMatches, drawsInPreviousHomeMatches, homeTeamFailScroringInMostHomeFixtures, awayTeamWinsMostMatchesTimes} from "./shared-functions";

export const predictDraw = ({
    currentFixtures,
    allFixtures,
    leaguesStandings,
  }: {
    currentFixtures: FixtureDataModel[];
    allFixtures: FixtureDataModel[];
    leaguesStandings: StandingsModel[];
  }) => {
    const predictedFixtures = currentFixtures.filter(currentFixture => {
      const lastFiveHomeTeamHomeFixtures = getLastFiveHomeTeamHomeFixtures({
        teamId: currentFixture.teams.home.id,
        allFixtures,
      });
      const lastFiveAwayTeamAwayFixtures = getLastFiveAwayTeamAwayFixtures({
        teamId: currentFixture.teams.away.id,
        allFixtures,
      });
      const fixtureH2hFixtures = getH2HFixtures({
        teamOneId: currentFixture.teams.home.id,
        teamTwoId: currentFixture.teams.away.id,
        allFixtures,
      });
      const homeTeamStanding: StandingsDataStandingModel = getHomeTeamStanding({
        standings: leaguesStandings,
        homeTeamId: currentFixture.teams.home.id,
        leagueId: currentFixture.league.id,
      });
      const awayTeamStanding: StandingsDataStandingModel = getAwayTeamStanding({
        standings: leaguesStandings,
        awayTeamId: currentFixture.teams.away.id,
        leagueId: currentFixture.league.id,
      });
  
      if (
        lastFiveAwayTeamAwayFixtures.length < 3 ||
        lastFiveHomeTeamHomeFixtures.length < 3||
        !homeTeamStanding||
        !awayTeamStanding
      ) {
        return false;
      }
      return ((Math.abs(awayTeamStanding.rank - homeTeamStanding.rank)<=5  && Math.abs(againstAwayTeamGoalsPercentage({awayTeamStanding}) - homeTeamGoalsPercentage({homeTeamStanding}))<=5) && 
      (Math.abs(againstAwayTeamGoalsPercentage({awayTeamStanding}) - againstHomeTeamGoalsPercentage({homeTeamStanding}))<10 )) ||

     Math.abs(homeTeamStanding.rank-awayTeamStanding.rank)<=5 && drawsInPreviousAwayMatches({awayTeamFixtures: lastFiveAwayTeamAwayFixtures, percentage: 40}) && (drawsInPreviousHomeMatches({homeTeamFixtures: lastFiveHomeTeamHomeFixtures, percentage: 40}))||

     ((awayTeamStanding.rank <=7 && Math.abs(homeTeamStanding.rank - awayTeamStanding.rank)>=4 && awayTeamWinsMostMatchesTimes({fixtures: lastFiveAwayTeamAwayFixtures, awayTeamId: lastFiveAwayTeamAwayFixtures[0].teams.away.id}) )&& 
      (awayTeamStanding.points - homeTeamStanding.points)>5)
    
    });
    return {
      fixtures: predictedFixtures,
      option: betOptions.find(option => option.id === betOptionsEnum.DRAW) as betOptionModel,
    }; // can look into making that betoption a enum
  };