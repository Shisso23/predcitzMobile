import { betOptionsEnum } from "../enums/bet-options.enums";
import { betOptionModel } from "../models/bet-option-model";
import { FixtureDataModel } from "../models/fixtures";
import { StandingsDataStandingModel, StandingsModel } from "../models/standings-models";
import { betOptions } from "../data-config/data-config";
import { getLastFiveHomeTeamHomeFixtures, againstHomeTeamGoalsPercentage, awayTeamGoalsPercentage, awayTeamFailScroringInMostAwayFixtures, getAwayTeamStanding, getHomeTeamStanding, getLastFiveAwayTeamAwayFixtures } from "./shared-functions";

export const predictHomeCleanSheet = ({
    currentFixtures,
    allFixtures,
    leaguesStandings,
  }: {
    currentFixtures: FixtureDataModel[];
    allFixtures: FixtureDataModel[];
    leaguesStandings: StandingsModel[];
  }) => {
    const predictedFixtures = currentFixtures.filter(currentFixture => {
      const lastFiveAwayTeamAwayFixtures = getLastFiveAwayTeamAwayFixtures({
        teamId: currentFixture.teams.away.id,
        allFixtures,
      });
      const lastFiveHomeTeamHomeFixtures = getLastFiveHomeTeamHomeFixtures({
        teamId: currentFixture.teams.home.id,
        allFixtures,
    });
      const awayTeamStanding: StandingsDataStandingModel = getAwayTeamStanding({
        standings: leaguesStandings,
        awayTeamId: currentFixture.teams.away.id,
        leagueId: currentFixture.league.id,
      });
      const homeTeamStanding: StandingsDataStandingModel = getHomeTeamStanding({
        standings: leaguesStandings,
        homeTeamId: currentFixture.teams.home.id,
        leagueId: currentFixture.league.id,
      });
  
      if (lastFiveAwayTeamAwayFixtures.length < 3) {
        return false;
      }
      //TODO filter the fixtures that passes the H wins either half test here and return it
      return (
        againstHomeTeamGoalsPercentage({ homeTeamStanding }) <= 87 &&
        awayTeamGoalsPercentage({ awayTeamStanding }) <= 90  && awayTeamFailScroringInMostAwayFixtures({awayfixtures: lastFiveAwayTeamAwayFixtures}) && (awayTeamStanding?.rank > homeTeamStanding?.rank )  && (awayTeamStanding?.rank - homeTeamStanding?.rank <=3)
      );
    });
    return {
      fixtures: predictedFixtures,
      option: betOptions.find(option => option.id === betOptionsEnum.HOME_CLEAN_SHEET) as betOptionModel,
    }; //TODO can look into making that betoption id a enum
  };
