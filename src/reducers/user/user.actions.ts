import {AnyAction} from '@reduxjs/toolkit';
import {setUsername} from './user.reducer';

export const setUserNameAction =
  (username: string) =>
  (
    dispatch: ({payload, type}: {payload: string; type: string}) => AnyAction,
  ) => {
    return dispatch(setUsername(username));
  };
