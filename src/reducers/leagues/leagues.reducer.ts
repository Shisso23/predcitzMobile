import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {LeagueDataModel, LeaguesModel} from '../../models/leagues/index';
export interface LeaguesState {
  leagues: LeaguesModel | null;
  isLoadingLeagues: Boolean;
  selectedLeagues: LeagueDataModel[];
  predictedLeagues: LeagueDataModel[];
}

const initialState: LeaguesState = {
  leagues: null,
  isLoadingLeagues: false,
  selectedLeagues: [],
  predictedLeagues: [],
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
    setPredictedleagues: (state, action: PayloadAction<LeagueDataModel[]>) => {
      state.predictedLeagues = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLeagues,
  setIsLoadingLeagues,
  setSelectedLeagues,
  setPredictedleagues,
} = leaguesSlice.actions;
export const leaguesSelector = (reducers: any) => reducers.leaguesReducer;
export default leaguesSlice.reducer;
