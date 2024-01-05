import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface AppState {
  debugging: boolean;
}

const initialState: AppState = {
  debugging: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDebugging: (state, action: PayloadAction<boolean>) => {
      state.debugging = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setDebugging} = appSlice.actions;
export const appSelector = (reducers: any) => reducers.appReducer;
export default appSlice.reducer;
