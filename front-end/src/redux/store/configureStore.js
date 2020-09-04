import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from '../rootSaga';
import { uiReducer } from '../ui/reducer';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { authReducer } from '../auth/reducer';
import { serviceReducer } from '../service/reducer';
import { doctorReducer } from '../doctor/reducer';
import { userReducer } from '../user/reducer';
import { patientReducer } from '../patient/reducer';
import { userPackageReducer } from '../user/reducer';
import { bookingReducer } from '../booking/reducer';
import { slotReducer } from '../slot/reducer';
import { packageReducer } from '../package/reducer';
import { notifyReducer } from '../notification/reducer';
import { chatReducer } from '../chat/reducer';
import { callReducer, ringtoneReducer } from '../call/reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'ringtone'] // only navigation will be persisted
};

const rootReducers = combineReducers({
  booking: bookingReducer,
  ui: uiReducer,
  loadingBar: loadingBarReducer,
  auth: authReducer,
  service: serviceReducer,
  doctor: doctorReducer,
  user: userReducer,
  patient: patientReducer,
  slot: slotReducer,
  userPackage: userPackageReducer,
  package: packageReducer,
  notify: notifyReducer,
  chat: chatReducer,
  call: callReducer,
  ringtone: ringtoneReducer
});

const saga = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = createStore(persistedReducer, applyMiddleware(saga));
saga.run(rootSaga);

export default () => {
  let persistor = persistStore(store);
  return { store, persistor };
};
