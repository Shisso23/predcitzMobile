import {
  setLeagues,
  setIsLoadingLeagues,
  setSelectedLeagues,
  setPredictedleagues,
} from './leagues.reducer';
import leauesService from '../../services/leagues';
import {LeagueDataModel, LeaguesFilterModel} from '../../models/leagues';

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

export const setSelectedLeaguesAction =
  async (selectedLeagues: LeagueDataModel[]) => async (dispatch: Function) => {
    return dispatch(setSelectedLeagues(selectedLeagues));
  };

export const setPredictedLeaguesAction =
  (predictedLeagues: LeagueDataModel[]) => (dispatch: Function) => {
    dispatch(setPredictedleagues(predictedLeagues));
  };
