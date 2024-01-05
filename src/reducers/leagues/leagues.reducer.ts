import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {LeagueDataModel, LeaguesModel} from '../../models/leagues/index';
export interface LeaguesState {
  leagues: LeaguesModel | null;
  isLoadingLeagues: Boolean;
  selectedLeagues: LeagueDataModel[];
}

const initialState: LeaguesState = {
  leagues: null,
  isLoadingLeagues: false,
  selectedLeagues: [],
};

export const leaguesSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    setLeagues: (state, action: PayloadAction<LeaguesModel>) => {
      state.leagues = action.payload;
    },
    setSelectedLeagues: (state, action: PayloadAction<LeagueDataModel[]>) => {
      state.selectedLeagues = action.payload;
    },
    setIsLoadingLeagues: (state, action: PayloadAction<Boolean>) => {
      state.isLoadingLeagues = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLeagues, setIsLoadingLeagues, setSelectedLeagues} =
  leaguesSlice.actions;
export const leaguesSelector = (reducers: any) => reducers.leaguesReducer;
export default leaguesSlice.reducer;
