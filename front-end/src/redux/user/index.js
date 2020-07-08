import {
    GET_USER_SUCCESSFUL, GET_USER, CLEAR_USER_INFO,
    GET_USER_PROFILE, GET_USER_PROFILE_SUCCESSFUL, EDIT_USER_PROFILE, EDIT_AVATAR, EDIT_USER_PROFILE_SUCCESSFUL, RESET_UPLOAD_STATUS,
    CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESSFUL, CHANGE_EMAIL, CHANGE_EMAIL_SUCCESSFUL, RESET_SETTING_STATUS,
    CHANGE_PHONE_VERIFY, CHANGE_PHONE_VERIFY_SUCCESSFUL, CHANGE_PHONE_SUCCESSFUL,
    CHANGE_PHONE, CHANGE_PHONE_CANCEL, CHANGE_PHONE_CANCEL_SUCCESSFUL,
    GET_PATIENT, GET_PATIENT_SUCCESSFUL, GET_USER_PACKAGE, GET_USER_PACKAGE_SUCCESSFUL
} from "./action"

export const getUser = (token) => {
    return {
        type: GET_USER,
        token
    }
}

export const clearUserInfo = () => {
    return {
        type: CLEAR_USER_INFO,
    }
}

export const getUserSuccessful = (currentUser) => {
    return {
        type: GET_USER_SUCCESSFUL,
        currentUser: currentUser
    }
}

export const getUserProfile = (userID, token) => {
    return {
        type: GET_USER_PROFILE,
        userID,
        token
    }
}

export const getUserProfileSuccessful = (userProfile) => {
    return {
        type: GET_USER_PROFILE_SUCCESSFUL,
        userProfile: userProfile
    }
}

export const editUserProfile = (updateProfile, customerID, patientID, token) => {
    return {
        type: EDIT_USER_PROFILE,
        updateProfile,
        customerID,
        patientID,
        token
    }
}

export const editAvatar = (avatar, customerID, patientID, token) => {
    return {
        type: EDIT_AVATAR,
        avatar,
        customerID,
        patientID,
        token
    }
}

export const editUserProfileSuccessful = (isSuccess) => {
    return {
        type: EDIT_USER_PROFILE_SUCCESSFUL,
        isSuccess
    }
}

export const resetUploadStatus = () => {
    return {
        type: RESET_UPLOAD_STATUS
    }
}

export const changePassword = (token, data, customerID) => {
    return {
        type: CHANGE_PASSWORD,
        token,
        data,
        customerID
    }
}

export const changePasswordSuccessful = (status) => {
    return {
        type: CHANGE_PASSWORD_SUCCESSFUL,
        status
    }
}

export const changeEmail = (token, data, customerID) => {
    return {
        type: CHANGE_EMAIL,
        token,
        data,
        customerID
    }
}

export const changeEmailSuccessful = (status) => {
    return {
        type: CHANGE_EMAIL_SUCCESSFUL,
        status
    }
}

export const verifyChangePhone = (token, data, customerID) => {
    return {
        type: CHANGE_PHONE_VERIFY,
        token,
        data,
        customerID
    }
}

export const verifyChangePhoneSuccessful = (requestID, phoneNumber) => {
    return {
        type: CHANGE_PHONE_VERIFY_SUCCESSFUL,
        requestID,
        phoneNumber
    }
}

export const changePhone = (token, data, customerID) => {
    return {
        type: CHANGE_PHONE,
        token,
        data,
        customerID
    }
}

export const changePhoneSuccessful = () => {
    return {
        type: CHANGE_PHONE_SUCCESSFUL
    }
}

export const cancelChangePhone = (requestID) => {
    return {
        type: CHANGE_PHONE_CANCEL,
        requestID
    }
}

export const cancelChangePhoneSuccessful = () => {
    return {
        type: CHANGE_PHONE_CANCEL_SUCCESSFUL
    }
}

export const resetSettingStatus = () => {
    return {
        type: RESET_SETTING_STATUS
    }
}

export const getPatient = () => {
    return {
        type: GET_PATIENT,
    }
}

export const getPatientSuccessful = (data) => {
    return {
        type: GET_PATIENT_SUCCESSFUL,
        data
    }
}

export const getUserPackage = (params) => {
    return {
        type: GET_USER_PACKAGE,
        params
    }
}

export const getUserPackageSuccessful = (packages) => {
    return {
        type: GET_USER_PACKAGE_SUCCESSFUL,
        packages
    }
}