import {configureStore} from '@reduxjs/toolkit';
import ReduxThunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import {persistedReducer} from '../redux/configureStore';

const middleware = [ReduxThunk, ReduxPromise];

// Infer the `RootState` and `AppDispatch` types from the store itself
// export default createStore(reducers, applyMiddleware(ReduxThunk));

export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(middleware),
});
