import {
    GET_USER_SUCCESSFUL, CLEAR_USER_INFO,
    GET_USER_PROFILE_SUCCESSFUL, EDIT_USER_PROFILE_SUCCESSFUL, RESET_UPLOAD_STATUS,
    CHANGE_PASSWORD_SUCCESSFUL, CHANGE_EMAIL_SUCCESSFUL, CHANGE_PHONE_SUCCESSFUL, CHANGE_PHONE_VERIFY_SUCCESSFUL, CHANGE_PHONE_CANCEL_SUCCESSFUL,
    RESET_SETTING_STATUS,
    GET_PATIENT_SUCCESSFUL, GET_USER_PACKAGE_SUCCESSFUL
} from "./action";

const initialState = {
    currentUser: {},
    userProfile: null,

    requestID: null,
    phoneNumber: null,
    currentStep: 0,
    uploadStatus: null,
    settingStatus: false
}

const initialStatePackage = {
    userPackage: [],
    patients: [],
}

export const userPackageReducer = (state = initialStatePackage, action) => {
    switch (action.type) {
        case GET_PATIENT_SUCCESSFUL: {
            state = { ...state, patients: action.data }
            return state
        }
        case GET_USER_PACKAGE_SUCCESSFUL: {
            state = { ...state, userPackage: action.packages }
            return state;
        }
        default:
            return state;
    }
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_SUCCESSFUL:
            state = { ...state, currentUser: action.currentUser }
            return state;
        case CLEAR_USER_INFO:
            return initialState;
        case GET_USER_PROFILE_SUCCESSFUL:
            state = { ...state, userProfile: action?.userProfile }
            return state;
        case EDIT_USER_PROFILE_SUCCESSFUL:
            state = { ...state, uploadStatus: action?.isSuccess }
            return state;
        case RESET_UPLOAD_STATUS:
            state = { ...state, userProfile: null, uploadStatus: null }
            return state;
        case CHANGE_EMAIL_SUCCESSFUL:
            state = { ...state, settingStatus: action?.status }
            return state;
        case CHANGE_PHONE_VERIFY_SUCCESSFUL:
            state = { ...state, requestID: action?.requestID, currentStep: 1, phoneNumber: action?.phoneNumber }
            return state;
        case CHANGE_PHONE_SUCCESSFUL:
            state = { ...state, requestID: null, currentStep: 0, phoneNumber: null, settingStatus: true }
            return state;
        case CHANGE_PHONE_CANCEL_SUCCESSFUL:
            state = { ...state, requestID: null, currentStep: 0, phoneNumber: null, settingStatus: false }
            return state;
        case CHANGE_PASSWORD_SUCCESSFUL:
            state = { ...state, settingStatus: action?.status }
            return state;
        case RESET_SETTING_STATUS:
            state = { ...state, userProfile: null, settingStatus: false }
            return state;
        default:
            return state;
    }
}