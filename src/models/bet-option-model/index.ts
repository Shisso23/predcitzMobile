import {FixtureDataModel} from '../fixtures';
import {StandingsModel} from '../standings-models';

export class betOptionModel {
  public name: String;
  public id: number;
  public level: number;
  public shortName: String;
  public description: string;
  public predict: ({
    currentFixtures,
    allFixtures,
    leaguesStandings,
  }: {
    currentFixtures: FixtureDataModel[];
    allFixtures: FixtureDataModel[];
    leaguesStandings: StandingsModel[];
  }) => {fixtures: FixtureDataModel[]; option: betOptionModel};
  /**
   *
   */
  constructor(init: betOptionModel) {
    this.name = init.name;
    this.id = init.id;
    this.level = init.level;
    this.shortName = init.shortName;
    this.predict = init.predict;
    this.description = init.description;
  }
}
