import {
    USER_LOGIN, USER_LOGOUT, USER_LOGIN_SUCCESSFUL,
    GUEST_SEND_PHONE, GUEST_SEND_PHONE_SUCCESSFUL, GUEST_SEND_OTP, GUEST_SEND_OTP_SUCCESSFUL, GUEST_REGISTER, GUEST_REGISTER_SUCCESSFUL, RESET_STEP_REGISTER,
    FORGOT_PASSWORD_SEND_PHONE, FORGOT_PASSWORD_SEND_PHONE_SUCCESSFUL, FORGOT_PASSWORD_SET_STEP, FORGOT_PASSWORD_CANCEL_REQUEST, FORGOT_PASSWORD_CANCEL_REQUEST_SUCCESSFUL,
    FORGOT_PASSWORD_RESET_PASSWORD, FORGOT_PASSWORD_RESET_PASSWORD_SUCCESSFUL, FORGOT_PASSWORD_SEND_OTP_SUCCESSFUL, FORGOT_PASSWORD_SEND_OTP
} from "./action"

export const userLogin = (userInfo) => {
    return {
        type: USER_LOGIN,
        user: userInfo,
    }
}

export const userLogout = () => {
    return {
        type: USER_LOGOUT,
    }
}

export const userLoginSuccessful = (token) => {
    return {
        type: USER_LOGIN_SUCCESSFUL,
        token
    }
}

export const forgotPasswordSetStep = (step) => {
    return {
        type: FORGOT_PASSWORD_SET_STEP,
        step
    }
}

export const forgotPasswordSendPhone = (phone) => {
    return {
        type: FORGOT_PASSWORD_SEND_PHONE,
        phone
    }
}

export const forgotPasswordSendPhoneSuccessful = (requestID) => {
    return {
        type: FORGOT_PASSWORD_SEND_PHONE_SUCCESSFUL,
        requestID
    }
}

export const forgotPasswordSendOTP = (requestID, otp) => {
    return {
        type: FORGOT_PASSWORD_SEND_OTP,
        requestID,
        otp
    }
}

export const forgotPasswordSendOTPSuccessful = () => {
    return {
        type: FORGOT_PASSWORD_SEND_OTP_SUCCESSFUL
    }
}

export const resetPassword = (requestID, password, confirm_password) => {
    return {
        type: FORGOT_PASSWORD_RESET_PASSWORD,
        requestID,
        password,
        confirm_password
    }
}

export const resetPasswordDone = () => {
    return {
        type: FORGOT_PASSWORD_RESET_PASSWORD_SUCCESSFUL
    }
}

export const forgotPasswordCancel = (requestID) => {
    return {
        type: FORGOT_PASSWORD_CANCEL_REQUEST,
        requestID
    }
}

export const forgotPasswordCancelDone = () => {
    return {
        type: FORGOT_PASSWORD_CANCEL_REQUEST_SUCCESSFUL
    }
}

export const guestSendPhone = (data) => {
    return {
        type: GUEST_SEND_PHONE,
        basicData: data
    }
}

export const guestSendPhoneSuccessful = (requestID, phoneNumber, fullName, dob, gender) => {
    return {
        type: GUEST_SEND_PHONE_SUCCESSFUL,
        requestID: requestID,
        phoneNumber: phoneNumber,
        fullName: fullName,
        dob: dob,
        gender: gender
    }
}

export const guestSendOTP = (data) => {
    return {
        type: GUEST_SEND_OTP,
        dataOTP: data
    }
}

export const guestSendOTPSuccessful = () => {
    return {
        type: GUEST_SEND_OTP_SUCCESSFUL
    }
}

export const guestRegister = (registerInfo) => {
    return {
        type: GUEST_REGISTER,
        info: registerInfo
    }
}

export const guestRegisterSuccessful = () => {
    return {
        type: GUEST_REGISTER_SUCCESSFUL
    }
}

export const setProcessRegister = (step) => {
    return {
        type: RESET_STEP_REGISTER,
        stepRegister: step
    }
}