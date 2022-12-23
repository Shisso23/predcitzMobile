import {StackNavigationProp} from '@react-navigation/stack';
import {FixtureDataModel} from '../../models/fixtures';
import {StandingsModel} from '../../models/standings-models';

export type AppStackList = {
  home: undefined;
  thankyou: undefined;
  fixtureDetails: {
    leaguesStandings: StandingsModel[];
    fixture: FixtureDataModel;
    allFixtures: FixtureDataModel[];
  };
};
export type AppStackProps = StackNavigationProp<AppStackList>;
