import { put, takeLatest, select, all, takeEvery } from 'redux-saga/effects';
import userService from "../../service/userService";
import {
    GET_USER,
    GET_USER_PROFILE, EDIT_USER_PROFILE, EDIT_AVATAR, CHANGE_PASSWORD, CHANGE_EMAIL, CHANGE_PHONE, CHANGE_PHONE_VERIFY, CHANGE_PHONE_CANCEL,
    GET_PATIENT, GET_USER_PACKAGE, SUBCRIBE_EMAIL, VERIFY_EMAIL
} from './action';
import {
    getUserSuccessful, getUserProfile,
    getUserProfileSuccessful, editUserProfileSuccessful, changePasswordSuccessful, changeEmailSuccessful,
    verifyChangePhoneSuccessful, changePhoneSuccessful, cancelChangePhoneSuccessful,
    getPatientSuccessful, getUserPackageSuccessful, getUser, verifyEmailSuccessful, saveTimeOut
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
        if (error?.response?.status  === 403 || error?.response?.status  === 401) {
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
        if (action.avatar && action.customerID && action.patientID && action.token) {
            const result = yield userService.editAvatar(action.avatar, action.customerID, action.patientID, action.token);
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
                yield put(getUserProfile(action.customerID, action.token));
                message.success('Cập nhật email thành công! Xin kiểm tra hòm thư để xác thực Email mới!', 3)
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
        if (action.token && action.data && action.customerID) {
            const result = yield userService.verifyChangePhone(action.token, action.data, action.customerID);
            if (result && result.request_id) {
                yield put(verifyChangePhoneSuccessful(result.request_id, action.data.phone));
                yield put(saveTimeOut(Date.now() + 300000));
                message.success('Xác nhận thành công!', 3)
            }
        }
    } catch (error) {
        if (error.response?.data?.status === "10") {
            message.error("SĐT này cần chờ 5 phút để gửi lại yêu cầu!", 4);
        }else
            message.error(error?.response?.data?.err, 3)
    } finally {
        yield put(closeLoading())
    }
}

function* watchChangePhone(action) {
    try {
        yield put(openLoading());
        if (action.token && action.data && action.customerID) {
            const result = yield userService.changePhone(action.token, action.data, action.customerID);
            if (result) {
                yield put(changePhoneSuccessful());
                yield put(saveTimeOut(0));
                message.success('Cập nhật số điện thoại thành công!', 3)
            }
        }
    } catch (error) {
        message.destroy();
        if (error.response?.data?.err?.status === "101") {
            message.error("Đường truyền bị gián đoạn, xin hãy thử lại!", 5);
        } else if (error.response?.data?.status === "16") {
            message.error("Mã OTP không chính xác!", 4);
        } else {
            message.error(error?.response?.data?.err ?? "Hệ thống quá tải!", 3);
        }
    } finally {
        yield put(closeLoading())
    }
}

function* watchChangePhoneCancel(action) {
    try {
        yield put(openLoading())

        /*  100% Cancel Request Successfully after force user wait 30s minimum.

            Checked case: before 5 minutes (since lastest time user sent Change pass request (step 1)) → cancel req → re-request step 1
            SO, no need to worry if our backend request cancel that "request_id" (otpID) to Nexmo server failed (error status 3).
        */
       
        message.destroy();
        yield put(cancelChangePhoneSuccessful());
        yield put(saveTimeOut(0));
        message.success('Huỷ yêu cầu thành công!', 3);

        if(action.requestID){
            yield userService.cancelChangePhone(action.requestID);
        }
    } catch (error) {
        if(error?.response?.data?.err){
            message.destroy();
            message.error(error?.response?.data?.err, 3);
        } 
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
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchVerifyEmail(action) {
    try {
        yield put(openLoading());
        const result = yield userService.verifyEmail(action.tokenEmail);
        if (result) {
            message.destroy();
            yield put(verifyEmailSuccessful(true));
            message.success('Xác thực email thành công! Giờ bạn có thể nhận email từ hệ thống', 4);
        }
    } catch (error) {
        yield put(verifyEmailSuccessful(error?.response?.data?.err??false));
        message.destroy();
        message.error(error?.response?.data?.err, 4)
    } finally {
        yield put(closeLoading())
    }
}

function* watchSubcribeEmail(action) {
    try {
        yield put(openLoading());
        const {token} = yield select(state => state.auth);
        const { currentUser } = yield select(state => state.user)
        if(action.type === 0){
            const result = yield userService.subscribeEmail(token, currentUser?.cusId, action.data);
            if (result?.customerUpdated) {
                message.destroy();
                message.success(action.data.mail_subscribe==="true"?'Đăng kí email thành công! Giờ bạn có thể nhận email từ hệ thống':'Huỷ đăng kí email thành công!', 4)
                yield put(getUser(token));
            }
        }else{
            const result = yield userService.unSubscribeEmail(action.data);
            console.log(result)

            if(result){
                message.destroy();
                yield put(verifyEmailSuccessful(true));
                message.success('Huỷ đăng kí email thành công!', 4);
            } 
        } 
    } catch (error) {
        if(action.type === 1){
            yield put(verifyEmailSuccessful(error?.response?.data?.err ?? false));
        }
        message.destroy();
        message.error(error?.response?.data?.err, 4)
    } finally {
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
    yield takeLatest(VERIFY_EMAIL, watchVerifyEmail);
    yield takeLatest(SUBCRIBE_EMAIL, watchSubcribeEmail);
}