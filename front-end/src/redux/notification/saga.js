import { put, takeLatest, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { GET_USER_NOTIFICATION, GET_MORE_USER_NOTIFICATION, MARK_READ_NOTIFY, MARK_ALL_READ, COUNT_UNREAD_NOTIFY } from './action';
import notifycationService from '../../service/notifycationService';
import _ from "lodash"
import { getUserNotificationSuccessful, getMoreUserNotificationSuccessful, getUserNotification, countUnreadNotifySuccessful, countUnreadNotify } from '.';
import { message } from 'antd';


function* watchGetUserNotifyWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.getCustomerNotify(action?.data, token);
        if (!_.isEmpty(result?.notifications?.result)) {
            yield put(getUserNotificationSuccessful(result?.notifications))
        } else {
            yield put(getUserNotificationSuccessful({ result: [], isOutOfData: true }))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchGetMoreUserNotifyWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.getCustomerNotify(action?.data, token);
        if (!_.isEmpty(result?.notifications)) {
            yield put(getMoreUserNotificationSuccessful(result?.notifications))
        } else {
            yield put(getMoreUserNotificationSuccessful({ result: [], isOutOfData: true }))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchMarkReadNotify(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.markReadNotify(action?.data, token);
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


function* watchmarkAllReadNotify(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.markAllRead(action?.data, token);
        if (!_.isEmpty(result?.notificationsUpdated)) {
            yield put(getUserNotification(action?.data))
            yield put(countUnreadNotify({receiver_id: action?.data.id}))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchcountUnreadNotifyWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.countUnreadNotify(action?.data, token);
        if (result?.num) {
            yield put(countUnreadNotifySuccessful(result?.num))
        } else {
            yield put(countUnreadNotifySuccessful(0))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err.toString())
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


export function* notifySaga() {
    yield takeLatest(GET_USER_NOTIFICATION, watchGetUserNotifyWorker);
    yield takeLatest(GET_MORE_USER_NOTIFICATION, watchGetMoreUserNotifyWorker);
    yield takeLatest(MARK_READ_NOTIFY, watchMarkReadNotify);
    yield takeLatest(MARK_ALL_READ, watchmarkAllReadNotify);
    yield takeLatest(COUNT_UNREAD_NOTIFY, watchcountUnreadNotifyWorker);
}