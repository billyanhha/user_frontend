import { all } from 'redux-saga/effects';
import { uiSaga } from './ui/saga';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { authSaga } from './auth/saga';
import { serviceSaga } from './service/saga';
import { doctorSaga } from './doctor/saga';
import { userSaga } from './user/saga';
import { patientSaga } from './patient/saga';
import { bookingSaga } from './booking/saga';
import { slotSaga } from './slot/saga';
import { packageSaga } from './package/saga';
import { notifySaga } from './notification/saga';
import { chatSaga } from './chat/saga';

export function* rootSaga() {
  yield all([
    uiSaga(),
    loadingBarMiddleware(),
    authSaga(),
    serviceSaga(),
    doctorSaga(),
    userSaga(),
    patientSaga(),
    bookingSaga(),
    slotSaga(),
    packageSaga(),
    notifySaga(),
    chatSaga()
  ]);
}
