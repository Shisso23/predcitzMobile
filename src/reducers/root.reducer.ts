import {combineReducers} from 'redux';
import store from '../redux/store';
import userReducer from './user/user.reducer';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default combineReducers({
  userReducer,
});
