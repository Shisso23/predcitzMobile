import {createStore} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import reducers from '../reducers/root.reducer';
import {persistStore, persistReducer} from 'redux-persist';

// Infer the `RootState` and `AppDispatch` types from the store itself
// export default createStore(reducers, applyMiddleware(ReduxThunk));

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['userReducer'],
};

export const persistedReducer = persistReducer(persistConfig, reducers);

let store = createStore(persistedReducer);
export const persistor = persistStore(store);
