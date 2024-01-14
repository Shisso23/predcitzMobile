import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {FixtureDataModel, FixturesModel} from '../../models/fixtures/index';
import {betOptionModel} from '../../models/bet-option-model';

export interface FixturesState {
  fixtures: FixturesModel;
  isLoadingFixtures: Boolean;
  allFixtures: FixtureDataModel[];
  predictedFixtures: {
    fixtures: FixtureDataModel[];
    option: betOptionModel;
  }[];
}

const initialState: FixturesState = {
  fixtures: null,
  isLoadingFixtures: false,
  predictedFixtures: [],
  allFixtures: [],
};

export const fixturesSlice = createSlice({
  name: 'fixtures',
  initialState,
  reducers: {
    setFixtures: (state, action: PayloadAction<FixturesModel>) => {
      state.fixtures = action.payload;
    },
    setIsLoadingFixtures: (state, action: PayloadAction<Boolean>) => {
      state.isLoadingFixtures = action.payload;
    },
    setAllFixtures: (state, action: PayloadAction<FixtureDataModel[]>) => {
      state.allFixtures = action.payload;
    },
    setPredictedFixtures: (
      state,
      action: PayloadAction<
        {
          fixtures: FixtureDataModel[];
          option: betOptionModel;
        }[]
      >,
    ) => {
      state.predictedFixtures = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setFixtures,
  setIsLoadingFixtures,
  setPredictedFixtures,
  setAllFixtures,
} = fixturesSlice.actions;
export const fixturesSelector = (reducers: any) => reducers.fixturesReducer;
export default fixturesSlice.reducer;
