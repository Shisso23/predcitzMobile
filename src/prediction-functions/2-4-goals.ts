import { betOptionsEnum } from "../enums/bet-options.enums";
import { betOptionModel } from "../models/bet-option-model";
import { FixtureDataModel } from "../models/fixtures";
import { StandingsDataStandingModel, StandingsModel } from "../models/standings-models";
import { betOptions } from "../data-config/data-config";
import { getLastFiveHomeTeamHomeFixtures, getLastFiveAwayTeamAwayFixtures, getH2HFixtures, fixtureTotalMinMax, awayTeamScroreInMostAwayFixtures, getAwayTeamStanding, getHomeTeamStanding, otherAwayTeamGoalsInHomeFixtures, againstHomeTeamGoalsPercentage, awayTeamGoalsPercentage, HomeTeamScroreInMostHomeFixtures, otherHomeTeamGoalsInAwayFixtures, homeTeamGoalsPercentage, againstAwayTeamGoalsPercentage } from "./shared-functions";


export const predict2_4_goals = ({
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

      const h2hFixtures = getH2HFixtures({
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
      const isAwayOver0_5 =  awayTeamScroreInMostAwayFixtures({
        awayfixtures: lastFiveAwayTeamAwayFixtures,
        minGoals: 1,
      }) &&
      otherAwayTeamGoalsInHomeFixtures({
        homeTeamFixtures: lastFiveHomeTeamHomeFixtures,
        goals: 1,
      }) &&
      awayTeamGoalsPercentage({ awayTeamStanding }) >= 150 &&
        (awayTeamStanding?.rank< homeTeamStanding?.rank ) &&
      againstHomeTeamGoalsPercentage({ homeTeamStanding }) >= 130

      const isHomeOver0_5 =   HomeTeamScroreInMostHomeFixtures({
        homefixtures: lastFiveHomeTeamHomeFixtures,
        minGoals: 1,
      }) &&
      otherHomeTeamGoalsInAwayFixtures({
        awayTeamFixtures: lastFiveAwayTeamAwayFixtures,
        goals: 1,
      }) &&
      homeTeamGoalsPercentage({ homeTeamStanding }) >= 150 &&
       (homeTeamStanding?.rank< awayTeamStanding?.rank ) &&
againstAwayTeamGoalsPercentage({ awayTeamStanding }) >= 130
  
      if (lastFiveHomeTeamHomeFixtures.length < 3 || lastFiveAwayTeamAwayFixtures.length<3 || h2hFixtures.length<3) {
        return false;
      }
      return (
      ( isHomeOver0_5
       && fixtureTotalMinMax({fixtures: lastFiveHomeTeamHomeFixtures, maxGoals: 4, minGoals: 2, occurencePercentage: 80})) ||
       isAwayOver0_5
       && fixtureTotalMinMax({fixtures: lastFiveAwayTeamAwayFixtures, maxGoals: 4, minGoals: 2, occurencePercentage: 80})
      ) && fixtureTotalMinMax({fixtures: h2hFixtures, maxGoals: 4, minGoals: 2, occurencePercentage: 80});
    });
    return {
      fixtures: predictedFixtures,
      option: betOptions.find(option => option.id === betOptionsEnum.TOTAL_2_4_GOALS) as betOptionModel,
    }; 
  };