import {StandingsModel} from '../../models/standings-models';
import {setLeaguesStandings} from './standings.reducer';

export const setStandingsAction =
  (leaguesStandings: StandingsModel[]) => (dispatch: Function) => {
    return dispatch(setLeaguesStandings(leaguesStandings));
  };
