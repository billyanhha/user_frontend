import { put, takeLatest, select, all, takeEvery } from 'redux-saga/effects';
import userService from "../../service/userService";
import {
    GET_USER,
    GET_USER_PROFILE, EDIT_USER_PROFILE, EDIT_AVATAR, CHANGE_PASSWORD, CHANGE_EMAIL, CHANGE_PHONE, CHANGE_PHONE_VERIFY, CHANGE_PHONE_CANCEL,
    GET_PATIENT, GET_USER_PACKAGE
} from './action';
import {
    getUserSuccessful, getUserProfile,
    getUserProfileSuccessful, editUserProfileSuccessful, changePasswordSuccessful, changeEmailSuccessful,
    verifyChangePhone, verifyChangePhoneSuccessful, changePhoneSuccessful, cancelChangePhoneSuccessful,
    getPatientSuccessful, getUserPackageSuccessful
} from '.'
import { userLogout } from '../auth';
import { message } from 'antd';
import { openLoading, closeLoading } from '../ui';
import _ from "lodash"

function* wachGetUserbWorker(action) {
    try {
        yield put(openLoading())
        if (action.token) {
            const result = yield userService.getUser(action.token);
            if (result && result.data) {
                yield put(getUserSuccessful(result.data));
            }
        }
    } catch (error) {
        if (error?.response?.status  === 401) {
            yield put(userLogout());
            message.destroy();
            message.error('Phiên đã hết hạn , vui lòng đăng nhập lại', 3)
        }
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchGetUserProfile(action) {
    try {
        yield put(openLoading());
        if (action.userID) {
            const result = yield userService.getUserProfile(action.userID, action.token);
            if (result && result?.independent[0]) {
                yield put(getUserProfileSuccessful(result?.independent[0]));
            }
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }
}

function* watchEditUserProfile(action) {
    try {
        yield put(openLoading());
        if (action.updateProfile && action.customerID && action.patientID && action.token) {
            const result = yield userService.editUserProfile(action.updateProfile, action.customerID, action.patientID, action.token);
            if (result && result?.patientUpdated?.message === "update successfully") {
                yield put(editUserProfileSuccessful(true));
                message.success('Cập nhật hồ sơ thành công!', 3);
            } else {
                yield put(editUserProfileSuccessful(false));
            }
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }
}

function* watchEditAvatar(action) {
    try {
        yield put(openLoading());
        console.log(action)
        if (action.avatar && action.customerID && action.patientID && action.token) {
            const result = yield userService.editAvatar(action.avatar, action.customerID, action.patientID, action.token);
            console.log(result)
            if (result && result?.patientUpdated?.message === "update successfully") {
                yield put(editUserProfileSuccessful(true));
                message.success('Cập nhật ảnh đại diện thành công!', 3)
            } else {
                yield put(editUserProfileSuccessful(false));
            }
        }
    } catch (error) {
        message.error(error?.response?.data?.err ?? 'Tập tin không hợp lệ, xin hãy chọn ảnh!', 3)

    } finally {
        yield put(closeLoading())
    }
}

function* watchChangeEmail(action) {
    try {
        yield put(openLoading());
        if (action.token && action.data && action.customerID) {
            const result = yield userService.changeEmail(action.token, action.data, action.customerID);
            if (result) {
                yield put(changeEmailSuccessful(true));
                message.success('Cập nhật email thành công!', 3)
            }
        }
    } catch (error) {
        yield put(changeEmailSuccessful(false));
        message.error(error?.response?.data?.err, 3)
    } finally {
        yield put(closeLoading())
    }
}

function* watchVerifyChangePhone(action) {
    try {
        yield put(openLoading());
        console.log(action)
        if (action.token && action.data && action.customerID) {
            const result = yield userService.verifyChangePhone(action.token, action.data, action.customerID);
            console.log(result)
            if (result && result.request_id) {
                yield put(verifyChangePhoneSuccessful(result.request_id, action.data.phone));
                // yield put(verifyChangePhoneSuccessful("fakeid", "84942865066"));
                message.success('Xác nhận thành công!', 3)
            }
        }
    } catch (error) {
        message.error(error?.response?.data?.err, 3)
    } finally {
        yield put(closeLoading())
    }
}

function* watchChangePhone(action) {
    try {
        yield put(openLoading());
        if (action.token && action.data && action.customerID) {
            console.log(action)
            const result = yield userService.changePhone(action.token, action.data, action.customerID);
            console.log(result)
            if (result) {
                yield put(changePhoneSuccessful());
                message.success('Cập nhật số điện thoại thành công!', 3)
            }
        }
    } catch (error) {
        message.destroy();
        if (error.response?.data?.status === "10") {
            message.destroy();
            message.error("SĐT này cần chờ 5 phút để gửi lại yêu cầu!", 4);
        } else {
            message.destroy();
            message.error(error?.response?.data?.err ?? "Hệ thống quá tải!", 3);
        }
    } finally {
        yield put(closeLoading())
    }
}

function* watchChangePhoneCancel(action) {
    try {
        yield put(openLoading())
        message.loading('Đang gửi yêu cầu');
        const result = yield userService.cancelChangePhone(action.requestID);
        if (result) {
            yield put(cancelChangePhoneSuccessful());
            message.destroy();
            message.success('Huỷ yêu cầu thành công!', 3);
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? "Hệ thống quá tải!", 3);
    } finally {
        yield put(closeLoading())
    }
}

function* watchChangePassword(action) {
    try {
        yield put(openLoading());
        if (action.token && action.data && action.customerID) {
            const result = yield userService.changePassword(action.token, action.data, action.customerID);
            if (result) {
                yield put(changePasswordSuccessful(true));
                message.success('Cập nhật mật khẩu thành công!', 3)
            }
        }
    } catch (error) {
        yield put(changePasswordSuccessful(false));
        message.error(error?.response?.data?.err, 3)
    } finally {
        yield put(closeLoading())
    }
}

function* wachGetPatientbWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const { currentUser } = yield select(state => state.user);
        const result = yield userService.getCustomerPatient(currentUser?.cusId, token);
        if (!_.isEmpty(result?.patients)) {
            yield put(getPatientSuccessful(result?.patients));
        } else {
            yield put(getPatientSuccessful([]));

        }
    } catch (error) {
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* wachGetUserPackageWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const { currentUser } = yield select(state => state.user)
        const result = yield userService.getUserPackage(action.params, currentUser?.cusId, token);
        yield put(getUserPackageSuccessful(result?.packages));
    } catch (error) {
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

export function* userSaga() {
    yield takeLatest(GET_USER, wachGetUserbWorker);
    yield takeLatest(GET_USER_PROFILE, watchGetUserProfile);
    yield takeLatest(EDIT_USER_PROFILE, watchEditUserProfile);
    yield takeLatest(EDIT_AVATAR, watchEditAvatar);
    yield takeLatest(CHANGE_EMAIL, watchChangeEmail);
    yield takeLatest(CHANGE_PHONE_VERIFY, watchVerifyChangePhone);
    yield takeLatest(CHANGE_PHONE_CANCEL, watchChangePhoneCancel);
    yield takeLatest(CHANGE_PHONE, watchChangePhone);
    yield takeLatest(CHANGE_PASSWORD, watchChangePassword);
    yield takeLatest(GET_PATIENT, wachGetPatientbWorker)
    yield takeLatest(GET_USER_PACKAGE, wachGetUserPackageWorker)
}