import {createStore, applyMiddleware} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import ReduxThunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';

import reducers from '../reducers/root.reducer';

const middleware = [ReduxThunk, ReduxPromise];

// Infer the `RootState` and `AppDispatch` types from the store itself
// export default createStore(reducers, applyMiddleware(ReduxThunk));

export default configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middleware),
});
