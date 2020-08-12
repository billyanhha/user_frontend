import { put, takeLatest, select } from 'redux-saga/effects';
import { GET_CHAT, GET_MORE_CHAT, GET_THREAD_CHAT, GET_MORE_THREAD_CHAT } from './action';
import _ from 'lodash';
import { openLoading, closeLoading } from '../ui';
import { message } from 'antd';
import chatService from '../../service/chatService';
import { getChatSuccessful, getMoreChatSuccessful, getThreadChatSuccessful, getMoreThreadChatSuccessful } from '.';


function* watchGetChatWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getChat(action.payload, token);
        if (!_.isEmpty(result?.result)) {

            yield put(getChatSuccessful(result?.result));
        } else {
            yield put(getChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}

function* watchGetMoreChatWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getMoreChat(action.payload , token);
        if (!_.isEmpty(result?.result)) {

            yield put(getMoreChatSuccessful(result?.result));
        } else {
            yield put(getMoreChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}

function* watchGetThreadChatWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getThreadChat(action.payload , token);
        if (!_.isEmpty(result?.result)) {

            yield put(getThreadChatSuccessful(result?.result));
        } else {
            yield put(getThreadChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}

function* watchGetMoreThreadChatWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getMoreThreadChat(action.payload , token);
        if (!_.isEmpty(result?.result)) {

            yield put(getMoreThreadChatSuccessful(result?.result));
        } else {
            yield put(getMoreThreadChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}



export function* chatSaga() {

    yield takeLatest(GET_CHAT, watchGetChatWorker);
    yield takeLatest(GET_MORE_CHAT, watchGetMoreChatWorker);
    yield takeLatest(GET_THREAD_CHAT, watchGetThreadChatWorker);
    yield takeLatest(GET_MORE_THREAD_CHAT, watchGetMoreThreadChatWorker);

}