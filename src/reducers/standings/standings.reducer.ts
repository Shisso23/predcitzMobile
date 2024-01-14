import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {StandingsModel} from '../../models/standings-models';

export interface FixturesState {
  leaguesStandings: StandingsModel[];
}

const initialState: FixturesState = {
  leaguesStandings: [],
};

export const standingsSlice = createSlice({
  name: 'standings',
  initialState,
  reducers: {
    setLeaguesStandings: (state, action: PayloadAction<StandingsModel[]>) => {
      state.leaguesStandings = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLeaguesStandings} = standingsSlice.actions;
export const standingsSelector = (reducers: any) => reducers.standingsReducer;
export default standingsSlice.reducer;
