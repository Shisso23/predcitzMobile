import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface userState {
  username: string;
}

const initialState: userState = {
  username: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUsername} = userSlice.actions;
export const userSelector = (reducers: any) => reducers.userReducer;
export default userSlice.reducer;
