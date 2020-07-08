import { put, takeLatest, select, all, takeEvery } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { GET_DOCTOR_FOR_HOME, QUERY_DOCTOR, NEXT_QUERY_DOCTOR, GET_DOCTOR_DETAIL, GET_DOCTOR_LOGIN } from './action';
import doctorService from '../../service/doctorService'
import { saveDoctorForHome, queryDoctorSuccessful, nextQueryDoctorSuccessful, getDoctorDetailSuccessful, getDoctorLoginSuccessful } from '.';
import _ from 'lodash'
import { message } from 'antd';

function* watchGetDoctorForHomeWorker() {
    try {
        yield put(openLoading())
        const result = yield doctorService.getDoctorForHome();
        if (!_.isEmpty(result) && !_.isEmpty(result.doctors)) {
            yield put(saveDoctorForHome(result.doctors));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

function* watchQueryDoctorWorker(action) {
    try {
        yield put(openLoading());
        const result = yield doctorService.getDoctorQuery(action.query);

        if (!_.isEmpty(result) && !_.isEmpty(result?.doctors)) {
            yield put(queryDoctorSuccessful(result?.doctors));
        }
    } catch (error) {
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchNextQueryDoctorWorker(action) {
    try {
        yield put(openLoading());
        const result = yield doctorService.getDoctorQuery(action.query);
        if (!_.isEmpty(result) && !_.isEmpty(result?.doctors)) {
            yield put(nextQueryDoctorSuccessful(result?.doctors));
        }
    } catch (error) {
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchGetDoctorDetailWorker(action) {
    try {
        yield put(openLoading());        
        const result = yield doctorService.getDoctorDetail(action.data);
        if (!_.isEmpty(result)) {
            yield put(getDoctorDetailSuccessful(result));
        }
    } catch (error) {
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}





export function* doctorSaga() {
    yield takeLatest(GET_DOCTOR_FOR_HOME, watchGetDoctorForHomeWorker);
    yield takeLatest(QUERY_DOCTOR, watchQueryDoctorWorker);
    yield takeLatest(NEXT_QUERY_DOCTOR, watchNextQueryDoctorWorker);
    yield takeLatest(GET_DOCTOR_DETAIL, watchGetDoctorDetailWorker);
}