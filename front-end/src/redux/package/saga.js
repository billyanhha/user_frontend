import { put, takeLatest, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import {
    GET_PACKAGE_INFO,
    GET_PACKAGE_SERVICES,
    GET_PACKAGE_APPOINTMENTS,
    GET_PACKAGE_STATUS,
    UPDATE_PACKAGE,
    CHANGE_PACKAGE_STATUS,
    UPDATE_APPOINTMENT_PACKAGE,
    GET_ALL_APPOINTMENT,
    
    RATING_DOCTOR,
    UPDATE_RATING_DOCTOR,

} from './action';
import packageService from '../../service/packageService'
import {
    getPackageInfoSuccessful,
    getPackageServicesSuccessful,
    getPackageAppointmentsSuccessful,
    getPackageStatusSuccessful,
    getPackageInfo,
    getPackageStatus,
    getPackageAppointments,
    getAllAppointmentByPackageSuccessful
} from '.';
import _ from 'lodash'
import { message } from 'antd';
import moment from 'moment'


function* watchgetPackageInfoQuery(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageInfo(action?.id, token);
        if (!_.isEmpty(result?.package)) {
            yield put(getPackageInfoSuccessful(result?.package?.[0]));
        } else {
            yield put(getPackageInfoSuccessful({}));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchgetPackageServicesWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageServices(action?.id, token);
        if (!_.isEmpty(result?.services)) {
            yield put(getPackageServicesSuccessful(result?.services));
        } else {
            yield put(getPackageServicesSuccessful([]));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


function* watchgetPackageAppointmentsWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageAppointments(action?.id, token);
        if (!_.isEmpty(result?.appointments)) {
            yield put(getPackageAppointmentsSuccessful(result?.appointments));
        }
        else {
            yield put(getPackageAppointmentsSuccessful([]));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchgetPackageStatussWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageStatus(action?.id, token);
        if (!_.isEmpty(result?.status)) {
            yield put(getPackageStatusSuccessful(result?.status));
        } else {
            yield put(getPackageStatusSuccessful([]));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchUpdatePackageWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)

        const result = yield packageService.editPackage(action?.data, token);
        message.success("Sửa thành công");
        if (!_.isEmpty(result)) {
            yield put(getPackageInfo(action?.data?.package_id))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchChangePackageStatusWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.changePackageStatus(action?.data, token);
        message.success("Thay đổi trạng thái thành công");
        if (!_.isEmpty(result)) {
            yield put(getPackageStatus(action?.data?.packageId))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


function* watchUpdateAppointmentPackageWorker(action) {
    try {
        yield put(openLoading());
        window.location.hash = '';

        const result = yield packageService.updateAppointmentPackage(
            action?.patientId,
            action?.appointmentId,
            action?.data
        );
        if (!_.isEmpty(result)) {
            yield put(getPackageAppointments(action?.packageId))
            message.success("Sửa thành công")
            window.location.hash = action?.appointmentId;
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchRatingDoctorWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.ratingDoctor(
            action?.data,
            token
        );
        if (!_.isEmpty(result)) {
            window.location.reload()
            message.success("Cảm ơn bạn đã đánh giá")
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchGetAllAppointmentByPackageId(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getAllAppointmentByPackageID(action?.packageId,token);
        if (!_.isEmpty(result)) {
            yield put(getAllAppointmentByPackageSuccessful(result?.appointments));
        }
    } catch (error) {message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchUpdateRatingDoctorWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.updateRatingDoctor(
            action?.data,
            token
        );
        if (!_.isEmpty(result)) {
            message.success("Cảm ơn bạn đã đánh giá")
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

export function* packageSaga() {
    yield takeLatest(GET_PACKAGE_INFO, watchgetPackageInfoQuery);
    yield takeLatest(GET_PACKAGE_SERVICES, watchgetPackageServicesWorker);
    yield takeLatest(GET_PACKAGE_APPOINTMENTS, watchgetPackageAppointmentsWorker);
    yield takeLatest(GET_PACKAGE_STATUS, watchgetPackageStatussWorker);
    yield takeLatest(UPDATE_PACKAGE, watchUpdatePackageWorker);
    yield takeLatest(CHANGE_PACKAGE_STATUS, watchChangePackageStatusWorker);
    yield takeLatest(UPDATE_APPOINTMENT_PACKAGE, watchUpdateAppointmentPackageWorker);
    yield takeLatest(GET_ALL_APPOINTMENT, watchGetAllAppointmentByPackageId);
    
    yield takeLatest(RATING_DOCTOR, watchRatingDoctorWorker);
    yield takeLatest(UPDATE_RATING_DOCTOR, watchUpdateRatingDoctorWorker);

}