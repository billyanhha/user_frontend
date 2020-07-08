import { put, takeLatest, select } from 'redux-saga/effects';
import { GET_DOCTOR_COMING_APPOINTMENT, SAVE_BOOKING_DOCTOR, ADD_PACKAGE } from './action';
import bookingService from '../../service/bookingService'
import _ from 'lodash';
import { openLoading, closeLoading } from '../ui';
import { saveDoctorComingAppointment, getDoctorComingAppointment, clearDoctorComingAppointment, addPackageSuccessful, resetPackageForm } from '.';
import { message } from 'antd';

function* watchGetDoctorComingAppointmentWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield bookingService.getDoctorComingAppointment(action.doctorId, token);
        if (!_.isEmpty(result) && !_.isEmpty(result?.appointments)) {

            yield put(saveDoctorComingAppointment(result?.appointments));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading())
    }

}

function* watchSaveBookingDoctorWorker(action) {
    try {
        yield put(openLoading())
        yield put(clearDoctorComingAppointment());
        if (action?.doctor?.id) {
            yield put(getDoctorComingAppointment(action?.doctor?.id));
        }

    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading())
    }

}

function* watchAdddPackageWorker(action) {
    try {
        yield put(openLoading())
        yield put(addPackageSuccessful(false))
        const {token} = yield select(state => state.auth)
        const result = yield bookingService.addPackage(action.request, token);
        if(!_.isEmpty(result)){
            yield put(addPackageSuccessful(true))
            yield put(resetPackageForm())
        }
        message.success("Đăng kí thành công")
    } catch (error) {
        message.error(error?.response?.data?.err)
        console.log(error?.response);
    } finally {
        yield put(closeLoading())
    }

}






export function* bookingSaga() {
    yield takeLatest(GET_DOCTOR_COMING_APPOINTMENT, watchGetDoctorComingAppointmentWorker);
    yield takeLatest(SAVE_BOOKING_DOCTOR, watchSaveBookingDoctorWorker);
    yield takeLatest(ADD_PACKAGE, watchAdddPackageWorker);
}