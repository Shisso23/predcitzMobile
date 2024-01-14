import {FixtureDataModel, FixturesFilterModel} from '../../models/fixtures';
import {
  setFixtures,
  setIsLoadingFixtures,
  setPredictedFixtures,
  setAllFixtures,
} from './fixtures.reducer';
import {getFilteredFixtures} from '../../services/fixtures/index';
import {betOptionModel} from '../../models/bet-option-model';

export const geFilteredFixturesAction =
  async (filters: FixturesFilterModel) => async (dispatch: Function) => {
    dispatch(setIsLoadingFixtures(true));

    return getFilteredFixtures(filters)
      .then(fixtures => {
        return dispatch(setFixtures(fixtures.data));
      })
      .catch(error => error)
      .finally(() => {
        dispatch(setIsLoadingFixtures(false));
      });
  };

export const setAllFixturesAction =
  (fixtures: FixtureDataModel[]) => (dispatch: Function) => {
    return dispatch(setAllFixtures(fixtures));
  };

export const setPredictedFixturesAction =
  (
    fixtures: {
      fixtures: FixtureDataModel[];
      option: betOptionModel;
    }[],
  ) =>
  (dispatch: Function) => {
    return dispatch(setPredictedFixtures(fixtures));
  };
