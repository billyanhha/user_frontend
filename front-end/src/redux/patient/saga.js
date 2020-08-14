import { put, takeLatest } from 'redux-saga/effects';

import { openLoading, closeLoading } from '../ui';
import { getAllDependentSuccessful, createDependentSuccessful, getPackageProgressSuccessful,getCurrentHealthSuccessful } from '.';
import patientService from '../../service/patientService';
import { GET_ALL_DEPENDENT, CREATE_DEPENDENT, GET_PACKAGE_PROGRESS,GET_CURRENT_HEALTH } from './action';

import { message } from 'antd';
import _ from 'lodash'

function* watchGetAllDependent(action) {
    try {
        yield put(openLoading());
        if (action.customerID && action.token) {
            const result = yield patientService.getAllDependent(action.token, action.customerID);
            if (result?.patients) {
                yield put(getAllDependentSuccessful(result?.patients));
            }
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }
}

function* watchCreateDependent(action) {
    try {
        yield put(openLoading());
        if (action.customerID && action.token && action.data) {
            const result = yield patientService.createDependent(action.token, action.customerID, action.data);
            if (result.patientCreated) {
                yield put(createDependentSuccessful(true));
                message.destroy();
                message.success('Thêm người thân thành công!', 3);
            }
        }
    } catch (error) {
        yield put(createDependentSuccessful(false));
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }
}

function* watchGetPackageProgress(action) {
    try {
        yield put(openLoading());
        if (action.customerID && action.token) {
            const result = yield patientService.getPackageProgress(action.token, action.customerID);
            if (result?.packages) {
                yield put(getPackageProgressSuccessful(result?.packages));
            }
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, không thể lấy dữ liệu tiến độ!', 3);
    } finally {
        yield put(closeLoading())
    }
}

function* watchGetCurrentHealth(action) {
    try {
        yield put(openLoading());
        if (action) {
            const result = yield patientService.getCurrentHealth(action?.token, action?.patientID);
            if (!_.isEmpty(result)) {
                yield put(getCurrentHealthSuccessful(result));
            }
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }
}

export function* patientSaga() {
    yield takeLatest(GET_ALL_DEPENDENT, watchGetAllDependent);
    yield takeLatest(CREATE_DEPENDENT, watchCreateDependent);
    yield takeLatest(GET_PACKAGE_PROGRESS, watchGetPackageProgress);
    yield takeLatest(GET_CURRENT_HEALTH, watchGetCurrentHealth);
}