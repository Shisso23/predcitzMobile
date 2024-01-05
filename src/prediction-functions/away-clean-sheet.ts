import {betOptionsEnum} from '../enums/bet-options.enums';
import {betOptionModel} from '../models/bet-option-model';
import {FixtureDataModel} from '../models/fixtures';
import {
  StandingsDataStandingModel,
  StandingsModel,
} from '../models/standings-models';
import {betOptions} from '../data-config/data-config';
import {
  againstAwayTeamGoalsPercentage,
  homeTeamGoalsPercentage,
  homeTeamFailScroringInMostHomeFixtures,
  getLastFiveHomeTeamHomeFixtures,
  getLastFiveAwayTeamAwayFixtures,
  getAwayTeamStanding,
  getHomeTeamStanding,
} from './shared-functions';

export const predictAwayCleanSheet = ({
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
      againstAwayTeamGoalsPercentage({awayTeamStanding}) <= 87 &&
      homeTeamGoalsPercentage({homeTeamStanding}) <= 90 &&
      homeTeamFailScroringInMostHomeFixtures({
        homefixtures: lastFiveHomeTeamHomeFixtures,
      }) &&
      homeTeamStanding?.rank > awayTeamStanding?.rank &&
      homeTeamStanding?.rank - awayTeamStanding?.rank >= 3
    );
  });
  return {
    fixtures: predictedFixtures,
    option: betOptions.find(
      option => option.id === betOptionsEnum.AWAY_CLEAN_SHEET,
    ) as betOptionModel,
  }; //TODO can look into making that betoption id a enum
};
