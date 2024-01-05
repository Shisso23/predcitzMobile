import {setDebugging} from './app-reducer';

export const setDebuggingAction =
  async (debugging: boolean) => async (dispatch: Function) => {
    return dispatch(setDebugging(debugging));
  };
