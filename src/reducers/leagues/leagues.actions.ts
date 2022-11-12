import {setLeagues, setIsLoadingLeagues} from './leagues.reducer';
import leauesService from '../../services/leagues';
import {LeaguesFilterModel} from '../../models/leagues';

export const geFilteredLeaguesAction =
  async (filters: LeaguesFilterModel) => async (dispatch: Function) => {
    dispatch(setIsLoadingLeagues(true));
    return leauesService
      .getFilteredLeagues(filters)
      .then(leagues => {
        return dispatch(setLeagues(leagues.data));
      })
      .catch(error => error)
      .finally(() => {
        dispatch(setIsLoadingLeagues(false));
      });
  };
